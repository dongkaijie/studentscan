<!-- src/views/NotFound.vue -->
<template>
    <div class="error-page">
        <el-result
        icon="error"
        title="404"
        sub-title="抱歉，你访问的页面不存在"
        >
            <template #extra>
                <el-button type="primary" @click="$router.push('/')">
                返回首页
                </el-button>
            </template>
        </el-result>
    </div>
</template>

<style scoped>
    .error-page {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        min-height: 100vh;
        background-color: #f5f5f5;
    }
</style>