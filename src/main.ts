/**
 * 浏览器入口。
 *
 * 配置和项目自有文化说明必须先加载，因为应用启动时会从 `window` 读取它们。
 * 其余天文馆逻辑保留在 `app.ts`，构建时一起打包成一个浏览器脚本。
 */
import "./config";
import "./data/culture-notes";
import "./app";
