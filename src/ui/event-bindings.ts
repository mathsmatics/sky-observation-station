// @ts-nocheck

/**
 * UI 事件绑定只负责把 DOM 事件转交给现有控制函数。
 * 依赖按职责分组传入，避免形成一个难维护的“大接口”。
 */
export function createEventBindings(services) {
  const {
    dom: { $, document, window, navigator, location, performance },
    state: {
      state,
      skyPanKeys,
      getSkyReady,
      getCurrentSelected,
      getPlaying,
      setPlaying,
      setLastFrame,
      setLastKeyboardPanFrame,
      setDebugPointer,
      setFloatingObjectInfoDismissed,
    },
    time: {
      DateTime,
      TIME_FIELD_IDS,
      TIME_FIELD_ID_TO_KEY,
      markTimeFieldSelected,
      setTimeFieldWidths,
      noteTimeRenderDebug,
      timeFieldDebugText,
      moveTimeField,
      syncTimeInputs,
      commitObserverDateTimeInput,
      adjustTimeField,
      shiftObserverTimeByControl,
      readTimeStepValue,
      applyObserverDateTime,
      shiftObserverTime,
    },
    view: {
      save,
      applyI18n,
      applyVisualConfig,
      applyCultureMode,
      switchProjection,
      switchCoordinateSystem,
      resetCurrentCoordinateView,
      switchPoleAxisConstraint,
      updateRegionLegend,
      redrawAndSyncMapBox,
      scaleMapByFactor,
      mapScaleButtonFactor,
      applyFontScale,
      setPanel,
      updateDebugOverlay,
      scheduleSkyResize,
      saveCurrentProjectionView,
      updateHUD,
      updateFloatingObjectInfo,
    },
    observer: { resolveZone, setObserver },
    sky: {
      handleMapScaleWheel,
      beginPaneMarginDrag,
      movePaneMarginDrag,
      endPaneMarginDrag,
      isTextEditingTarget,
      panSkyByKeyboard,
      flushKeyboardPanView,
      queueDebugOverlayUpdate,
    },
    ui: {
      t,
      showToast,
      openTechnicalGuide,
      toggleGuidePageDropdown,
      openGuidePageDropdown,
      closeGuidePageDropdown,
      setGuidePage,
      resetAllDefaults,
      clearObjectInfo,
    },
  } = services;

  /**
   * 将 DOM 控件连接到状态更新、渲染更新和持久化。
   * 事件流刻意保持直接：控件 -> 修改状态 -> 重绘/应用。
   */
  function bind() {
    $("language-select").addEventListener("change", (e) => {
      state.lang = e.target.value === "en" ? "en" : "zh";
      save();
      applyI18n();
      applyVisualConfig(true);
    });
    $("culture-select").addEventListener("change", (e) => {
      state.cultureMode = ["western", "chinese", "both"].includes(
        e.target.value,
      )
        ? e.target.value
        : "western";
      applyCultureMode();
    });
    $("projection-select").addEventListener("change", (e) =>
      switchProjection(e.target.value),
    );
    const coordinateSelect = $("coordinate-select");
    let coordinateSelectOpenedValue = coordinateSelect.value;
    coordinateSelect.addEventListener("pointerdown", () => {
      coordinateSelectOpenedValue = coordinateSelect.value;
    });
    coordinateSelect.addEventListener("change", (e) =>
      switchCoordinateSystem(e.target.value),
    );
    coordinateSelect.addEventListener("blur", () => {
      if (
        coordinateSelect.value === coordinateSelectOpenedValue &&
        coordinateSelect.value === state.coordinateSystem
      )
        resetCurrentCoordinateView();
    });
    $("pole-axis-constraint")?.addEventListener("change", (e) =>
      switchPoleAxisConstraint(!!e.target.checked),
    );
    $("traditional-detail").addEventListener("change", (e) => {
      state.traditionalDetail = ["major", "battlefields", "mansions"].includes(
        e.target.value,
      )
        ? e.target.value
        : "battlefields";
      save();
      updateRegionLegend();
      redrawAndSyncMapBox("traditional detail");
    });
    $("apply-location").addEventListener("click", () => {
      const lat = Number($("observer-lat").value),
        lon = Number($("observer-lon").value),
        zone = resolveZone(lat, lon, null);
      setObserver(lat, lon, zone, "", "", true);
      showToast(`${t("autoZone")} · ${zone} · ${t("timezoneEstimated")}`);
    });
    document
      .querySelectorAll("[data-city-zh]")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          setObserver(
            btn.dataset.lat,
            btn.dataset.lon,
            btn.dataset.zone,
            btn.dataset.cityZh,
            btn.dataset.cityEn,
            true,
          ),
        ),
      );
    $("geolocate").addEventListener("click", () => {
      if (location.protocol === "file:") {
        showToast(t("localServerHint"), true);
        return;
      }
      if (!navigator.geolocation) {
        showToast(t("geoFail"), true);
        return;
      }
      showToast(t("geoRequest"));
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const z = resolveZone(
            pos.coords.latitude,
            pos.coords.longitude,
            null,
          );
          setObserver(
            pos.coords.latitude,
            pos.coords.longitude,
            z,
            "我的位置",
            "My location",
            false,
          );
          showToast(`${t("locationApplied")} · ${z}`);
        },
        () => showToast(t("geoFail"), true),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
      );
    });
    TIME_FIELD_IDS.forEach((id) => {
      const field = $(id);
      if (!field) return;
      field.dataset.replaceOnType = "1";
      field.addEventListener("focus", () => markTimeFieldSelected(field));
      field.addEventListener("click", () => markTimeFieldSelected(field));
      field.addEventListener("mouseup", (e) => {
        e.preventDefault();
        markTimeFieldSelected(field);
      });
      field.addEventListener("input", () => {
        field.value = field.value.replace(id === "time-year" ? /[^0-9-]/g : /\D/g, "");
        if (id === "time-year") field.value = field.value.replace(/(?!^)-/g, "");
        setTimeFieldWidths();
        noteTimeRenderDebug({
          inputStatus: "draft",
          activeField: TIME_FIELD_ID_TO_KEY[id] || "-",
          fields: timeFieldDebugText(),
        });
      });
      field.addEventListener("blur", (event) => {
        field.classList.remove("time-part-active");
        field.dataset.replaceOnType = "1";
        const shell = $("observer-time-fields");
        if (shell && event.relatedTarget && shell.contains(event.relatedTarget)) return;
        syncTimeInputs();
      });
      field.addEventListener("keydown", (e) => {
        if (e.isComposing) return;
        const key = TIME_FIELD_ID_TO_KEY[id];
        if (e.key === "Enter") {
          e.preventDefault();
          if (commitObserverDateTimeInput("Enter")) {
            field.dataset.replaceOnType = "1";
            markTimeFieldSelected(field);
          }
          return;
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          moveTimeField(id, e.key === "ArrowRight" ? 1 : -1);
          return;
        }
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
          e.preventDefault();
          adjustTimeField(key, e.key === "ArrowUp" ? 1 : -1);
          return;
        }
        if (/^[0-9]$/.test(e.key) || (id === "time-year" && e.key === "-")) {
          e.preventDefault();
          if (field.dataset.replaceOnType === "1") {
            field.value = "";
            field.dataset.replaceOnType = "0";
          }
          if (e.key === "-" && field.value.includes("-")) return;
          field.value += e.key;
          setTimeFieldWidths();
          markTimeFieldSelected(field);
          field.dataset.replaceOnType = "0";
          noteTimeRenderDebug({
            inputStatus: "draft",
            activeField: key || "-",
            fields: timeFieldDebugText(),
          });
          return;
        }
        if (e.key === "Backspace" || e.key === "Delete") {
          e.preventDefault();
          field.value = "";
          field.dataset.replaceOnType = "0";
          setTimeFieldWidths();
          noteTimeRenderDebug({
            inputStatus: "draft",
            activeField: key || "-",
            fields: timeFieldDebugText(),
          });
        }
      });
    });
    $("time-step-minus").addEventListener("click", () => shiftObserverTimeByControl(-1));
    $("time-step-plus").addEventListener("click", () => shiftObserverTimeByControl(1));
    $("time-step-value").addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.isComposing) {
        e.preventDefault();
        readTimeStepValue();
        $("time-step-value").blur();
      }
    });
    $("observer-now").addEventListener("click", () => {
      applyObserverDateTime(DateTime.utc(), true, "now");
      showToast(t("nowApplied"));
    });
    document
      .querySelectorAll("[data-shift-unit]")
      .forEach((btn) =>
        btn.addEventListener("click", () =>
          shiftObserverTime(btn.dataset.shiftUnit, btn.dataset.shiftValue, "shortcut"),
        ),
      );
    $("play").addEventListener("click", () => {
      setPlaying(!getPlaying());
      setLastFrame(performance.now());
      updateHUD(false);
    });
    $("speed").addEventListener("change", () => {
      state.speed = Number($("speed").value);
      save();
      updateHUD(false);
    });
    $("magnitude").addEventListener("input", () => {
      state.magnitude = Number($("magnitude").value);
      $("magnitude-value").textContent = state.magnitude.toFixed(1);
      save();
      applyVisualConfig();
    });
    $("star-size").addEventListener("input", () => {
      state.starSize = Number($("star-size").value);
      $("star-size-value").textContent = `${state.starSize} px`;
      save();
      applyVisualConfig();
    });
    $("star-name-density").addEventListener("input", () => {
      state.starNameMagnitudeLimit = Number($("star-name-density").value);
      $("star-name-density-value").textContent =
        state.starNameMagnitudeLimit.toFixed(1);
      save();
      applyVisualConfig();
    });
    const checks = {
      "star-names": "starNames",
      "culture-lines": "cultureLines",
      "culture-names": "cultureNames",
      planets: "planets",
      "milky-way": "milkyWay",
      grid: "grid",
      "horizontal-grid": "horizontalGrid",
      ecliptic: "ecliptic",
      equator: "equator",
      horizon: "horizon",
      "deep-sky": "deepSky",
      "floating-object-info": "floatingObjectInfo",
    };
    Object.entries(checks).forEach(([id, key]) =>
      $(id).addEventListener("change", (e) => {
        state[key] = e.target.checked;
        save();
        if (key === "floatingObjectInfo") {
          setFloatingObjectInfoDismissed(false);
          updateFloatingObjectInfo();
        } else applyVisualConfig(true);
      }),
    );
    $("region-boundaries").addEventListener("change", (e) => {
      if (state.cultureMode === "both") {
        e.target.checked = !!state.regionBoundaries;
        return;
      }
      state.regionBoundaries = e.target.checked;
      save();
      updateRegionLegend();
      applyVisualConfig(true);
      redrawAndSyncMapBox("region boundaries");
    });
    $("night-vision").addEventListener("change", (e) => {
      state.nightVision = e.target.checked;
      $("sky-stage").classList.toggle("night-vision", state.nightVision);
      save();
      showToast(state.nightVision ? t("nightOn") : t("nightOff"));
    });
    $("panel-toggle").addEventListener("click", () =>
      setPanel(!state.panelOpen),
    );
    $("zoom-in").addEventListener("click", () => {
      try {
        scaleMapByFactor(mapScaleButtonFactor());
        updateDebugOverlay();
      } catch (_) {}
    });
    $("zoom-out").addEventListener("click", () => {
      try {
        scaleMapByFactor(1 / mapScaleButtonFactor());
        updateDebugOverlay();
      } catch (_) {}
    });
    $("font-decrease").addEventListener("click", () => {
      state.fontScale = (Number(state.fontScale) || 1) / 1.08;
      applyFontScale();
      save();
      applyVisualConfig(true);
    });
    $("font-increase").addEventListener("click", () => {
      state.fontScale = (Number(state.fontScale) || 1) * 1.08;
      applyFontScale();
      save();
      applyVisualConfig(true);
    });
    $("reset-view").addEventListener("click", resetCurrentCoordinateView);
    $("fullscreen").addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement)
          await document.documentElement.requestFullscreen();
        else await document.exitFullscreen();
      } catch (_) {}
    });
    $("explain-btn").addEventListener("click", openTechnicalGuide);
    $("guide-page-trigger").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleGuidePageDropdown();
    });
    $("guide-page-trigger").addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openGuidePageDropdown();
        const first = $("guide-page-menu").querySelector(".guide-page-option");
        first?.focus();
      } else if (e.key === "Escape") {
        closeGuidePageDropdown();
      }
    });
    $("guide-page-menu").addEventListener("click", (e) => e.stopPropagation());
    document.addEventListener("click", (e) => {
      if (!$("guide-page-dropdown")?.contains(e.target)) closeGuidePageDropdown();
    });
    $("guide-next-page").addEventListener("click", () => setGuidePage(1));
    $("reset-defaults-btn").addEventListener("click", resetAllDefaults);
    $("close-modal").addEventListener("click", () =>
      $("tech-modal").classList.remove("open"),
    );
    $("tech-modal").addEventListener("click", (e) => {
      if (e.target === $("tech-modal"))
        $("tech-modal").classList.remove("open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeGuidePageDropdown();
        $("tech-modal").classList.remove("open");
        $("city-suggestions").classList.remove("open");
      }
    });
    $("copy-guide").addEventListener("click", async () => {
      const active = document.querySelector(
        state.lang === "zh" ? '[data-doc-lang="zh"]' : '[data-doc-lang="en"]',
      );
      try {
        await navigator.clipboard.writeText(
          active.dataset.copyText || active.innerText,
        );
        showToast(t("copied"));
      } catch (_) {
        showToast(t("copyFail"), true);
      }
    });
    $("close-object").addEventListener("click", clearObjectInfo);
    $("copy-object").addEventListener("click", async () => {
      const currentSelected = getCurrentSelected();
      if (!currentSelected) return;
      const text =
        $("object-info-title").textContent +
        "\n" +
        Array.from($("object-info-grid").children)
          .map((el) => el.textContent)
          .join("\n");
      try {
        await navigator.clipboard.writeText(text);
        showToast(t("copiedObject"));
      } catch (_) {
        showToast(t("copyFail"), true);
      }
    });
    $("sky-pane").addEventListener(
      "wheel",
      (e) => {
        if (!document.querySelector("#celestial-map canvas")) return;
        handleMapScaleWheel(e);
      },
      { passive: false },
    );
    $("sky-pane").addEventListener("pointerdown", beginPaneMarginDrag);
    $("sky-pane").addEventListener("pointermove", movePaneMarginDrag);
    $("sky-pane").addEventListener("pointerup", endPaneMarginDrag);
    $("sky-pane").addEventListener("pointercancel", endPaneMarginDrag);
    $("sky-pane").setAttribute("tabindex", "0");
    $("sky-pane").setAttribute(
      "aria-label",
      state.lang === "zh" ? "星图区域，可用方向键平移" : "Sky map, use arrow keys to pan",
    );
    document.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      if (isTextEditingTarget(event.target)) return;
      if (!getSkyReady() || !window.Celestial) return;
      event.preventDefault();
      if (!skyPanKeys.has(event.key)) {
        skyPanKeys.add(event.key);
        panSkyByKeyboard(event.key);
        setLastKeyboardPanFrame(performance.now());
        queueDebugOverlayUpdate();
      }
    });
    document.addEventListener("keyup", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      if (skyPanKeys.delete(event.key)) {
        if (!skyPanKeys.size) flushKeyboardPanView();
        queueDebugOverlayUpdate();
      }
    });
    window.addEventListener("blur", () => {
      if (!skyPanKeys.size) return;
      skyPanKeys.clear();
      flushKeyboardPanView();
      queueDebugOverlayUpdate();
    });
    window.addEventListener("pointerup", () => {
      const m = $("celestial-map");
      if (m) m.classList.remove("dragging");
      setDebugPointer(false, null);
      if (getSkyReady()) {
        saveCurrentProjectionView();
        save();
      }
    });
    window.addEventListener("resize", () => scheduleSkyResize("window.resize"));
    window.addEventListener("orientationchange", () => scheduleSkyResize("orientationchange"));
    window.addEventListener("pageshow", () => scheduleSkyResize("pageshow"));
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", () => scheduleSkyResize("visualViewport.resize"));
      window.visualViewport.addEventListener("scroll", () => scheduleSkyResize("visualViewport.scroll"));
    }
  }

  return { bind };
}
