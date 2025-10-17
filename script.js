// 图表实例存储
const chartInstances = {};

// 浅绿柠檬黄渐变主题颜色配置
const themeColors = {
    primary: '#66bb6a',    // 浅绿色
    secondary: '#ffeb3b',  // 柠檬黄色
    accent: '#81c784',     // 中等绿色
    light: '#c5e1a5'       // 淡绿色
};

// 初始化所有图表
function initAllCharts() {
    // 检查ECharts是否可用
    if (typeof echarts === 'undefined') {
        console.error('ECharts未加载，请检查网络连接');
        return;
    }

    // 初始化各个图表
    initLineChart();
    initBarChart();
    initHorizontalBarChart();
    initAreaChart();
    initHistogramChart();
    initPieChart();
    initScatterChart();
    initBoxplotChart();
    initRadarChart();
    initErrorBarChart();

    // 窗口调整大小时重绘图表
    window.addEventListener('resize', function() {
        Object.values(chartInstances).forEach(chart => {
            if (chart) chart.resize();
        });
    });
}

// 折线图
function initLineChart() {
    const container = document.getElementById('lineChart');
    if (!container) return;
    
    const chart = echarts.init(container);
    chartInstances.lineChart = chart;
    
    const option = {
        animation: true,
        animationDuration: 2000,
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                return `第${params[0].axisValue}天<br/>最高: ${params[0].value}°C<br/>最低: ${params[1].value}°C`;
            }
        },
        legend: { data: ['最高气温', '最低气温'] },
        xAxis: {
            type: 'category',
            data: chartData.lineChart.x
        },
        yAxis: { type: 'value', name: '温度 (°C)' },
        series: [
            {
                name: '最高气温',
                type: 'line',
                data: chartData.lineChart.yMax,
                smooth: true,
                lineStyle: { color: themeColors.primary },
                itemStyle: { color: themeColors.primary }
            },
            {
                name: '最低气温',
                type: 'line',
                data: chartData.lineChart.yMin,
                smooth: true,
                lineStyle: { color: themeColors.secondary },
                itemStyle: { color: themeColors.secondary }
            }
        ]
    };
    chart.setOption(option);
}

// 柱形图
function initBarChart() {
    const container = document.getElementById('barChart');
    if (!container) return;
    
    const chart = echarts.init(container);
    chartInstances.barChart = chart;
    
    const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: chartData.barChart.years
        },
        yAxis: { type: 'value', name: 'GMV (亿元)' },
        series: [{
            type: 'bar',
            data: chartData.barChart.gmv,
            itemStyle: { color: themeColors.primary }
        }]
    };
    chart.setOption(option);
}

// 条形图
function initHorizontalBarChart() {
    const container = document.getElementById('horizontalBarChart');
    if (!container) return;
    
    const chart = echarts.init(container);
    chartInstances.horizontalBarChart = chart;
    
    const option = {
        tooltip: { trigger: 'axis' },
        grid: { left: '20%' },
        yAxis: {
            type: 'category',
            data: chartData.horizontalBarChart.categories
        },
        xAxis: {
            type: 'value',
            name: '网购替代率',
            axisLabel: { formatter: '{value}%' }
        },
        series: [{
            type: 'bar',
            data: chartData.horizontalBarChart.rates,
            itemStyle: { color: themeColors.secondary }
        }]
    };
    chart.setOption(option);
}

// 面积图
function initAreaChart() {
    const container = document.getElementById('areaChart');
    if (!container) return;
    
    const chart = echarts.init(container);
    chartInstances.areaChart = chart;
    
    const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['公司A', '公司B', '公司C'] },
        xAxis: {
            type: 'category',
            data: chartData.areaChart.months
        },
        yAxis: { type: 'value', name: '物流费用 (万元)' },
        series: [
            {
                name: '公司A',
                type: 'line',
                stack: 'Total',
                data: chartData.areaChart.companyA,
                areaStyle: { color: 'rgba(102, 187, 106, 0.4)' }
            },
            {
                name: '公司B',
                type: 'line',
                stack: 'Total',
                data: chartData.areaChart.companyB,
                areaStyle: { color: 'rgba(255, 235, 59, 0.4)' }
            },
            {
                name: '公司C',
                type: 'line',
                stack: 'Total',
                data: chartData.areaChart.companyC,
                areaStyle: { color: 'rgba(129, 199, 132, 0.4)' }
            }
        ]
    };
    chart.setOption(option);
}

// 直方图
function initHistogramChart() {
    const container = document.getElementById('histogramChart');
    if (!container) return;
    
    const chart = echarts.init(container);
    chartInstances.histogramChart = chart;
    
    // 计算直方图数据
    const data = chartData.histogramChart.data;
    const bins = 25;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;
    const histogramData = Array(bins).fill(0);
    
    data.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
        histogramData[binIndex]++;
    });
    
    const option = {
        tooltip: { trigger: 'axis' },
        xAxis: {
            type: 'category',
            data: Array.from({length: bins}, (_, i) => (min + i * binWidth).toFixed(1))
        },
        yAxis: { type: 'value', name: '频数' },
        series: [{
            type: 'bar',
            data: histogramData,
            itemStyle: { color: themeColors.accent }
        }]
    };
    chart.setOption(option);
}

// 饼图
function initPieChart() {
    const container = document.getElementById('pieChart');
    if (!container) return;
    
    const chart = echarts.init(container);
    chartInstances.pieChart = chart;
    
    const option = {
        tooltip: { trigger: 'item' },
        legend: { orient: 'vertical', left: 'left' },
        series: [{
            type: 'pie',
            radius: '50%',
            data: chartData.pieChart.categories.map((name, index) => ({
                name: name,
                value: chartData.pieChart.values[index]
            })),
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    chart.setOption(option);
}

// 散点图
function initScatterChart() {
    const container = document.getElementById('scatterChart');
    if (!container) return;
    
    const chart = echarts.init(container);
    chartInstances.scatterChart = chart;
    
    const option = {
        tooltip: { trigger: 'item' },
        xAxis: { type: 'value', name: '速度 (km/h)' },
        yAxis: { type: 'value', name: '制动距离 (m)' },
        series: [{
            type: 'scatter',
            data: chartData.scatterChart.speed.map((speed, index) => [
                speed, chartData.scatterChart.distance[index]
            ]),
            itemStyle: { color: themeColors.primary }
        }]
    };
    chart.setOption(option);
}

// 箱型图
function initBoxplotChart() {
    const container = document.getElementById('boxplotChart');
    if (!container) return;
    
    const chart = echarts.init(container);
    chartInstances.boxplotChart = chart;
    
    const option = {
        tooltip: { trigger: 'item' },
        legend: { data: ['2018年', '2017年'] },
        xAxis: { type: 'category', data: ['发电量统计'] },
        yAxis: { type: 'value', name: '发电量 (亿千瓦时)' },
        series: [
            {
                name: '2018年',
                type: 'boxplot',
                data: [chartData.boxplotChart.data2018],
                itemStyle: { color: themeColors.primary }
            },
            {
                name: '2017年',
                type: 'boxplot',
                data: [chartData.boxplotChart.data2017],
                itemStyle: { color: themeColors.secondary }
            }
        ]
    };
    chart.setOption(option);
}

// 雷达图
function initRadarChart() {
    const container = document.getElementById('radarChart');
    if (!container) return;
    
    const chart = echarts.init(container);
    chartInstances.radarChart = chart;
    
    const option = {
        tooltip: { trigger: 'item' },
        radar: {
            indicator: chartData.radarChart.dimensions.map(name => ({ name, max: 1 }))
        },
        series: [{
            type: 'radar',
            data: chartData.radarChart.data.map((values, index) => ({
                value: values,
                name: `测试者${index + 1}`
            }))
        }]
    };
    chart.setOption(option);
}

// 误差棒图
function initErrorBarChart() {
    const container = document.getElementById('errorBarChart');
    if (!container) return;
    
    const chart = echarts.init(container);
    chartInstances.errorBarChart = chart;
    
    const data = chartData.errorBarChart;
    const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['树种1', '树种2', '树种3', '树种4'] },
        xAxis: {
            type: 'category',
            data: data.seasons
        },
        yAxis: { type: 'value', name: '细根生物量 (g/m²)' },
        series: [
            {
                name: '树种1',
                type: 'bar',
                data: data.species1.values,
                itemStyle: { color: themeColors.primary }
            },
            {
                name: '树种2',
                type: 'bar',
                data: data.species2.values,
                itemStyle: { color: themeColors.secondary }
            },
            {
                name: '树种3',
                type: 'bar',
                data: data.species3.values,
                itemStyle: { color: themeColors.accent }
            },
            {
                name: '树种4',
                type: 'bar',
                data: data.species4.values,
                itemStyle: { color: '#fff59d' }
            }
        ]
    };
    chart.setOption(option);
}

// 页面加载完成后初始化图表
document.addEventListener('DOMContentLoaded', function() {
    // 等待ECharts加载
    if (typeof echarts === 'undefined') {
        setTimeout(initAllCharts, 100);
    } else {
        initAllCharts();
    }
});