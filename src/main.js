import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import './assets/css/icon.css'

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';

// 按需引入 highlightjs 的语言包，此处以 json 为例
import json from 'highlight.js/lib/languages/json';

VMdPreview.use(githubTheme);
VueMarkdownEditor.use(githubTheme, {
    extend(md, hljs) {
        // md为 markdown-it 实例，可以在此处进行修改配置,并使用 plugin 进行语法扩展
        // md.set(option).use(plugin);
        // 注册语言包
        hljs.registerLanguage('json', json);
    },
});

const app = createApp(App)
installElementPlus(app)

app
    .use(store)
    .use(router)
    .use(VMdPreview)
    .use(VueMarkdownEditor)
    .mount('#app')
