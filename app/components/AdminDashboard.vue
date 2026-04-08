<script setup>
import { ref, onMounted, onUnmounted, shallowRef, watch } from 'vue'
import * as echarts from 'echarts'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const trendChartRef = shallowRef(null)
const pieChartRef = shallowRef(null)
let trendChart = null
let pieChart = null

// Fetch data from backend
const { data: statsData, pending } = await useFetch('/api/admin/stats', {
    headers: { Authorization: `Bearer ${authStore.token}` }
})

// Initialize chart options after data load
onMounted(() => {
    initCharts()
    
    const resizeHandler = () => {
        trendChart?.resize()
        pieChart?.resize()
    }
    window.addEventListener('resize', resizeHandler)
    
    onUnmounted(() => {
        window.removeEventListener('resize', resizeHandler)
        trendChart?.dispose()
        pieChart?.dispose()
    })
})

// Watch for data changes if any
watch(statsData, () => {
    if (statsData.value) {
        updateCharts()
    }
})

function initCharts() {
    if (trendChartRef.value && !trendChart) {
        trendChart = echarts.init(trendChartRef.value)
    }
    if (pieChartRef.value && !pieChart) {
        pieChart = echarts.init(pieChartRef.value)
    }
    updateCharts()
}

function updateCharts() {
    if (!statsData.value) return

    const { trendData, pieData } = statsData.value

    if (trendChart) {
        trendChart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(28, 25, 23, 0.9)',
                borderColor: '#b45309',
                textStyle: { color: '#d6d3d1' }
            },
            grid: {
                left: '3%', right: '4%', bottom: '5%', top: '15%', containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: trendData?.dates || [],
                axisLine: { lineStyle: { color: '#57534e' } },
                axisLabel: { color: '#a8a29e' }
            },
            yAxis: {
                type: 'value',
                splitLine: { lineStyle: { color: '#292524', type: 'dashed' } },
                axisLabel: { color: '#a8a29e' }
            },
            series: [
                {
                    name: '新增文章',
                    type: 'line',
                    smooth: true,
                    lineStyle: { color: '#0ea5e9', width: 3 },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(14, 165, 233, 0.5)' },
                            { offset: 1, color: 'rgba(14, 165, 233, 0.0)' }
                        ])
                    },
                    itemStyle: { color: '#0ea5e9' },
                    data: trendData?.posts || []
                },
                {
                    name: '累计点亮',
                    type: 'line',
                    smooth: true,
                    lineStyle: { color: '#d97706', width: 3 },
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(217, 119, 6, 0.5)' },
                            { offset: 1, color: 'rgba(217, 119, 6, 0.0)' }
                        ])
                    },
                    itemStyle: { color: '#d97706' },
                    data: trendData?.lights || []
                }
            ]
        })
    }

    if (pieChart) {
        pieChart.setOption({
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(28, 25, 23, 0.9)',
                borderColor: '#b45309',
                textStyle: { color: '#d6d3d1' }
            },
            legend: {
                orient: 'vertical',
                right: '5%',
                top: 'middle',
                textStyle: { color: '#a8a29e' }
            },
            series: [
                {
                    name: '古建朝代分布',
                    type: 'pie',
                    radius: ['50%', '80%'],
                    center: ['40%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#1c1917',
                        borderWidth: 2
                    },
                    label: { show: false, position: 'center' },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: '#d97706'
                        }
                    },
                    labelLine: { show: false },
                    data: pieData || []
                }
            ]
        })
    }
}
</script>

<template>
    <div v-if="pending" class="flex items-center justify-center h-96 text-amber-500 animate-pulse text-lg">
        数据加载中...
    </div>
    
    <div v-else-if="statsData" class="flex flex-col gap-8 animate-fade-in w-full pb-10">
        <!-- 核心数据卡片行 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-bg-surface rounded-xl border border-border-default p-6 flex flex-col justify-between hover:border-amber-500/50 transition-colors group shadow-sm">
                <div class="flex justify-between items-start mb-4">
                    <span class="text-text-muted text-sm font-bold tracking-wider">总用户数</span>
                    <span class="text-3xl opacity-80 grayscale group-hover:grayscale-0 transition-all">👥</span>
                </div>
                <div>
                    <div class="text-4xl font-bold text-text-primary font-mono tracking-tight">{{ statsData.stats.totalUsers }}</div>
                    <div class="text-sm mt-2 text-text-muted">注册平台的用户总数</div>
                </div>
            </div>

            <div class="bg-bg-surface rounded-xl border border-border-default p-6 flex flex-col justify-between hover:border-amber-500/50 transition-colors group shadow-sm">
                <div class="flex justify-between items-start mb-4">
                    <span class="text-text-muted text-sm font-bold tracking-wider">今日新增</span>
                    <span class="text-3xl opacity-80 grayscale group-hover:grayscale-0 transition-all">✨</span>
                </div>
                <div>
                    <div class="text-4xl font-bold text-text-primary font-mono tracking-tight">{{ statsData.stats.todayUsers }}</div>
                    <div class="text-sm mt-2 text-text-muted">今日注册新用户数</div>
                </div>
            </div>

            <div class="bg-bg-surface rounded-xl border border-border-default p-6 flex flex-col justify-between hover:border-amber-500/50 transition-colors group shadow-sm">
                <div class="flex justify-between items-start mb-4">
                    <span class="text-text-muted text-sm font-bold tracking-wider">总文章数</span>
                    <span class="text-3xl opacity-80 grayscale group-hover:grayscale-0 transition-all">📜</span>
                </div>
                <div>
                    <div class="text-4xl font-bold text-text-primary font-mono tracking-tight">{{ statsData.stats.totalPosts }}</div>
                    <div class="text-sm mt-2 text-text-muted">平台所有已发布的文章</div>
                </div>
            </div>

            <div class="bg-bg-surface rounded-xl border border-border-default p-6 flex flex-col justify-between hover:border-amber-500/50 transition-colors group shadow-sm">
                <div class="flex justify-between items-start mb-4">
                    <span class="text-text-muted text-sm font-bold tracking-wider">地图点亮数</span>
                    <span class="text-3xl opacity-80 grayscale group-hover:grayscale-0 transition-all">🏛️</span>
                </div>
                <div>
                    <div class="text-4xl font-bold text-text-primary font-mono tracking-tight">{{ statsData.stats.litArchs }}</div>
                    <div class="text-sm mt-2 text-text-muted">已有文章关联的古建数量</div>
                </div>
            </div>
        </div>

        <!-- 图表行 -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- 趋势折线图 (宽) -->
            <div class="lg:col-span-8 bg-bg-surface rounded-xl border border-border-default p-8 flex flex-col relative overflow-hidden group shadow-sm min-h-[450px]">
                <div class="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-amber-900/30 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-amber-900/30 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div class="flex justify-between items-center mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-text-primary mb-2 tracking-wide">平台数据趋势</h2>
                        <p class="text-sm text-text-muted">近 7 天新增文章与地图点亮趋势</p>
                    </div>
                </div>
                
                <div class="flex-1 w-full" ref="trendChartRef"></div>
            </div>

            <!-- 分类占比图 (窄) -->
            <div class="lg:col-span-4 bg-bg-surface rounded-xl border border-border-default p-8 flex flex-col shadow-sm min-h-[450px]">
                <h3 class="text-text-primary text-xl font-bold tracking-wide mb-2">点亮古建朝代分布</h3>
                <p class="text-sm text-text-muted mb-6">已被点亮的古建筑按朝代统计</p>
                <div class="flex-1 w-full" ref="pieChartRef"></div>
            </div>
        </div>

        <!-- 列表行 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- 待办事项 / 最新动态 -->
            <div class="bg-bg-surface rounded-xl border border-border-default flex flex-col overflow-hidden shadow-sm min-h-[400px]">
                <div class="p-6 border-b border-border-default bg-bg-base/50 flex justify-between items-center">
                    <h3 class="text-text-primary text-lg font-bold flex items-center gap-3">
                        <span class="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                        最新动态提醒
                    </h3>
                </div>
                <div class="p-4 flex-1 overflow-y-auto space-y-3">
                    <div v-for="todo in statsData.todos" :key="todo.id" 
                        class="p-4 rounded-xl bg-bg-elevated/40 hover:bg-bg-elevated border border-transparent hover:border-border-default transition-all flex gap-4 items-start">
                        <div class="mt-1 text-2xl">
                            <span v-if="todo.type === 'audit'">📝</span>
                            <span v-else-if="todo.type === 'report'">🚨</span>
                            <span v-else-if="todo.type === 'data'">🏛️</span>
                            <span v-else>⚙️</span>
                        </div>
                        <div class="flex-1">
                            <div class="text-base text-text-primary font-medium leading-tight mb-2">{{ todo.text }}</div>
                            <div class="text-sm text-text-muted">{{ new Date(todo.time).toLocaleString() }}</div>
                        </div>
                    </div>
                    <div v-if="!statsData.todos?.length" class="text-center py-10 text-text-muted">
                        暂无最新动态
                    </div>
                </div>
            </div>

            <!-- 活跃榜单 -->
            <div class="bg-bg-surface rounded-xl border border-border-default flex flex-col overflow-hidden shadow-sm min-h-[400px]">
                <div class="p-6 border-b border-border-default bg-bg-base/50">
                    <h3 class="text-text-primary text-lg font-bold flex items-center gap-3">
                        <span>🏆</span> 活跃用户榜 (Top 5)
                    </h3>
                </div>
                <div class="p-4 flex-1 space-y-2 overflow-y-auto">
                    <div v-for="(user, idx) in statsData.activeUsers" :key="user.id" 
                        class="flex items-center gap-4 p-4 rounded-xl hover:bg-bg-elevated border border-transparent hover:border-border-default transition-all">
                        <div :class="['w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0', 
                            idx === 0 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 
                            idx === 1 ? 'bg-stone-300 text-stone-800 shadow-lg shadow-stone-300/20' : 
                            idx === 2 ? 'bg-amber-700 text-white shadow-lg shadow-amber-700/20' : 'bg-bg-base text-text-muted']">
                            {{ idx + 1 }}
                        </div>
                        <div class="w-12 h-12 rounded-full bg-bg-base flex items-center justify-center text-xl shrink-0 shadow-inner">
                            {{ user.avatar }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="text-lg font-bold text-text-primary truncate">{{ user.name }}</div>
                            <div class="text-sm text-text-muted mt-1">发布文章数: <span class="font-mono text-amber-500 font-bold">{{ user.points }}</span></div>
                        </div>
                    </div>
                    <div v-if="!statsData.activeUsers?.length" class="text-center py-10 text-text-muted">
                        暂无活跃用户
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
