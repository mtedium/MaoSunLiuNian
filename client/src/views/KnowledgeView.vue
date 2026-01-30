<template>
  <div class="knowledge-container">
    <div class="header">
      <h1>科普基因库</h1>
      <div class="filters">
        <button 
          v-for="cat in categories" 
          :key="cat"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <div class="articles-grid">
      <div 
        v-for="article in filteredArticles" 
        :key="article.id" 
        class="article-card"
        @click="openArticle(article)"
      >
        <div class="card-cover">
          <div class="vertical-title">{{ article.title }}</div>
        </div>
        <div class="card-meta">
          <span>{{ article.category }}</span>
          <span>{{ article.author }}</span>
        </div>
      </div>
    </div>

    <!-- Reading Modal -->
    <div v-if="currentArticle" class="reading-modal-overlay" @click.self="currentArticle = null">
      <div class="reading-modal">
        <button class="close-btn" @click="currentArticle = null">×</button>
        <div class="paper-texture">
          <div class="ancient-content">
            <h2 class="article-title">{{ currentArticle.title }}</h2>
            <div class="article-body">
              <p v-for="(para, index) in currentArticle.content" :key="index">{{ para }}</p>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="action-btn" @click="toggleFavorite">
            {{ isFavorite ? '❤️ 已收藏' : '🤍 收藏' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const categories = ['全部', '营造法式', '建筑流派', '匠人传记', '结构解析'];
const selectedCategory = ref('全部');
const currentArticle = ref(null);
const isFavorite = ref(false);

const articles = [
  {
    id: 1,
    title: '营造法式·大木作制度',
    category: '营造法式',
    author: '李诫',
    content: [
      '凡构屋之制，皆以材为祖。材有八等，度屋之大小，因而用之。',
      '一等材，高九寸，厚六寸，用于九间或十一间大殿。',
      '二等材，高八寸二分五厘，厚五寸五分，用于五间或七间大殿。',
      '此乃标准化之始也，令天下工匠有法可依，有度可循。'
    ]
  },
  {
    id: 2,
    title: '应县木塔之奇',
    category: '结构解析',
    author: '梁思成',
    content: [
      '应县木塔，全名佛宫寺释迦塔，高67.31米。',
      '全塔耗材红松木料三千立方米，无钉无铆，全凭榫卯咬合。',
      '其斗拱种类繁多，达五十四种之多，号称“斗拱博物馆”。',
      '历经千年风雨地震，巍然屹立，实乃世界建筑史之奇迹。'
    ]
  },
  {
    id: 3,
    title: '样式雷家族',
    category: '匠人传记',
    author: '佚名',
    content: [
      '清代皇家建筑设计世家，雷氏家族。',
      '七代人主持设计了圆明园、颐和园、承德避暑山庄等皇家园林。',
      '其留存的“样式雷图档”，已被列入世界记忆遗产名录。'
    ]
  }
];

const filteredArticles = computed(() => {
  if (selectedCategory.value === '全部') return articles;
  return articles.filter(a => a.category === selectedCategory.value);
});

const openArticle = (article) => {
  currentArticle.value = article;
  isFavorite.value = false; // Reset state, real app would check user favorites
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  // TODO: Call API to save favorite
};
</script>

<style scoped>
.knowledge-container {
  padding: 80px 40px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-family: 'Noto Serif SC', serif;
  color: var(--color-lacquer, #2b333e);
  margin-bottom: 20px;
}

.filters button {
  background: white;
  border: 1px solid #ddd;
  padding: 8px 20px;
  margin: 0 5px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.filters button.active {
  background: var(--color-cinnabar, #b13b2e);
  color: white;
  border-color: var(--color-cinnabar, #b13b2e);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.article-card {
  background: white;
  height: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-5px);
}

.card-cover {
  flex: 1;
  background-color: #f0e6d2; /* Parchment color */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px);
  background-size: 20px 100%;
}

.vertical-title {
  writing-mode: vertical-rl;
  font-family: 'Noto Serif SC', serif;
  font-size: 1.2rem;
  letter-spacing: 5px;
  color: #333;
  max-height: 200px;
}

.card-meta {
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #888;
  background: #fff;
}

/* Modal */
.reading-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.reading-modal {
  background: white;
  width: 90%;
  max-width: 800px;
  height: 80vh;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  z-index: 10;
}

.paper-texture {
  flex: 1;
  background-color: #fdfbf7;
  padding: 40px;
  overflow-y: auto;
  border-radius: 8px 8px 0 0;
  /* Simulating ancient book binding line */
  border-right: 5px double #ddd;
}

.ancient-content {
  writing-mode: vertical-rl;
  height: 100%;
  margin: 0 auto;
  text-align: justify;
}

.article-title {
  font-family: 'Noto Serif SC', serif;
  font-size: 2rem;
  margin-left: 30px; /* Space between title and body in vertical mode */
  border-left: 2px solid #b13b2e;
  padding-left: 10px;
  height: fit-content;
}

.article-body p {
  text-indent: 2em;
  line-height: 2;
  margin-left: 15px;
  font-size: 1.1rem;
}

.modal-actions {
  padding: 15px;
  border-top: 1px solid #eee;
  text-align: right;
  background: white;
  border-radius: 0 0 8px 8px;
}

.action-btn {
  padding: 8px 20px;
  background: var(--color-cinnabar, #b13b2e);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
