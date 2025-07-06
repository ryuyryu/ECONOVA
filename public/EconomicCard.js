"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _SparkChart = _interopRequireDefault(require("./SparkChart"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// ビルド後は .js 拡張子になるため、拡張子なしでインポート

/**
 * 経済指標カードのサンプルコンポーネント
 * SparkChart を使ってグラフを表示します
 */
var EconomicCard = function EconomicCard() {
  // サンプルデータ（月ごとのCPI）
  var values = [100, 103, 101, 104, 107, 110, 108];
  var labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月'];

  // 使い方メモに表示するHTML
  // 箇条書きではなく文章として表示します
  var usageHTML = "\n    <p>\n      \u6307\u6570\u306E\u52D5\u304D\u3092\u7C21\u6F54\u306B\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002<br />\n      \u30B0\u30E9\u30D5\u4E0A\u3092\u6307\u3067\u306A\u305E\u308B\u3068\u5024\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002<br />\n      \u4E0A\u6607\u3059\u308B\u3068\u8CFC\u8CB7\u529B\u304C\u4F4E\u4E0B\u3057\u666F\u6C17\u3092\u51B7\u3084\u3057\u307E\u3059\u3002\n    </p>";
  return (
    /*#__PURE__*/
    // ECOBOX と同じダーク系のデザインに変更
    // アクセントとして境界線に cyan 系の色を追加
    _react["default"].createElement("div", {
      className: "p-4 font-sans bg-gradient-to-b from-slate-800 to-slate-700 text-white rounded-xl shadow-md border-2 border-cyan-400 w-full max-w-md"
    }, /*#__PURE__*/_react["default"].createElement("p", {
      className: "text-sm font-bold mb-2"
    }, "CPI\uFF08\u6D88\u8CBB\u8005\u7269\u4FA1\u6307\u6570\uFF09"), /*#__PURE__*/_react["default"].createElement("div", {
      className: "flex items-start"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "w-1/3 pr-2 border-r border-slate-500"
    }, /*#__PURE__*/_react["default"].createElement(_SparkChart["default"], {
      data: values,
      labels: labels
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "usage-note ml-2 flex-1 text-sm text-slate-200 p-2 rounded-lg shadow-inner border border-slate-500 bg-slate-900/40",
      dangerouslySetInnerHTML: {
        __html: usageHTML
      }
    })), /*#__PURE__*/_react["default"].createElement("p", {
      className: "text-xs text-slate-300 mt-2"
    }, "\u524D\u6708\u6BD4 +2.3%"))
  );
};
var _default = exports["default"] = EconomicCard;
