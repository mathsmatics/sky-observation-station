// @ts-nocheck

/**
 * 时间输入动作只负责“用户怎么改时间”。
 * 真正的时间应用、星图刷新和错误展示仍由外部服务完成，避免形成大接口。
 */
export function createTimeInputActions(services) {
  const {
    dom: { $ },
    time: {
      observerDT,
      safeZoneForCoordinates,
      parseObserverTimeFields,
      applyObserverDateTime,
      syncTimeInputs,
      focusTimeField,
      timeFieldDebugText,
      noteTimeRenderDebug,
      reportInvalidTimeInput,
    },
    ui: { showToast, t },
  } = services;

  function commitObserverDateTimeInput(source = "Enter") {
    const dt = parseObserverTimeFields();
    if (!dt) {
      noteTimeRenderDebug({
        inputStatus: "invalid",
        fields: timeFieldDebugText(),
        updateSource: source,
        errorStage: "input",
        refreshHealth: "failed",
        currentFatalError: "time field parse failed",
        lastError: "time field parse failed",
      });
      reportInvalidTimeInput();
      syncTimeInputs();
      return false;
    }
    return applyObserverDateTime(dt, true, source);
  }

  function adjustTimeField(field, delta) {
    const base = observerDT().setZone(safeZoneForCoordinates());
    const units = {
      year: "years",
      month: "months",
      day: "days",
      hour: "hours",
      minute: "minutes",
    };
    const unit = units[field];
    if (!unit) return false;
    const change = {};
    change[unit] = delta;
    const ok = applyObserverDateTime(
      base.plus(change),
      true,
      `${field} ${delta > 0 ? "ArrowUp" : "ArrowDown"}`,
    );
    if (ok) focusTimeField(field);
    return ok;
  }

  function shiftObserverTime(unit, amount, source = "shortcut") {
    const delta = {};
    delta[unit] = Number(amount);
    return applyObserverDateTime(observerDT().plus(delta), true, source);
  }

  function readTimeStepValue() {
    const input = $("time-step-value");
    const value = Math.floor(Number(input && input.value));
    if (!Number.isFinite(value) || value < 1) {
      if (input) input.value = "1";
      showToast(t("invalidTimeStep"), true);
      return 1;
    }
    if (input) input.value = String(value);
    return value;
  }

  function shiftObserverTimeByControl(sign) {
    const unitSelect = $("time-step-unit");
    const unit = unitSelect ? unitSelect.value : "hours";
    if (!["minutes", "hours", "days", "years"].includes(unit)) return;
    shiftObserverTime(unit, readTimeStepValue() * (sign < 0 ? -1 : 1), "step");
  }

  return {
    commitObserverDateTimeInput,
    adjustTimeField,
    shiftObserverTime,
    readTimeStepValue,
    shiftObserverTimeByControl,
  };
}
