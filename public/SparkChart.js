"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _chart = require("chart.js");
var _reactChartjs = require("react-chartjs-2");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// Chart.jsで必要な要素を登録
_chart.Chart.register(_chart.LineElement, _chart.PointElement, _chart.CategoryScale, _chart.LinearScale, _chart.Tooltip);

/**
 * スパークライン風の折れ線グラフを表示するコンポーネント
 * @param {{ data: number[], labels: string[] }} props
 */
var SparkChart = function SparkChart(_ref) {
  var data = _ref.data,
    labels = _ref.labels;
  // グラフに渡すデータ設定
  var chartData = {
    labels: labels,
    datasets: [{
      data: data,
      borderColor: '#0cb195',
      // 線の色
      borderWidth: 2,
      fill: false,
      tension: 0.3,
      // ドットの見た目を指定
      pointRadius: 5,
      pointHoverRadius: 8,
      pointBackgroundColor: '#00fb00',
      pointBorderColor: '#ffffff',
      pointStyle: 'circle'
    }]
  };

  // 軸や凡例を非表示にしたシンプルなオプション
  var chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false,
      axis: 'x'
    },
    hover: {
      mode: 'nearest',
      intersect: false
    },
    animation: {
      duration: 300
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  };
  return (
    /*#__PURE__*/
    // 親要素の幅いっぱいに広がり、高さを固定
    _react["default"].createElement("div", {
      className: "h-24 w-full"
    }, /*#__PURE__*/_react["default"].createElement(_reactChartjs.Line, {
      data: chartData,
      options: chartOptions
    }))
  );
};
var _default = exports["default"] = SparkChart;
