<template>
    <div class="about">
        <v-header />
        <v-sidebar />
        <div class="content-box" :class="{ 'content-collapse': collapse }">
            <v-tags style="padding: 15px"></v-tags>
            <div class="content">
                <router-view :key="key" v-slot="{ Component }">
                    <transition name="move" mode="out-in">
                        <keep-alive :include="tagsList">
                            <component :is="Component" />
                        </keep-alive>
                    </transition>
                </router-view>
            </div>
        </div>
    </div>
</template>
<script>
import vHeader from "../../components/Header";
import vSidebar from "../../components/Sidebar";
import vTags from "../../components/Tags.vue";
export default {
    components: {
        vHeader,
        vSidebar,
        vTags
    },
    computed: {
        tagsList() {
            return this.$store.state.tagsList.map(item => item.name);
        },
        collapse() {
            return this.$store.state.collapse;
        },
        key() {
            console.log("this.$route.path-------"+this.$route.path)
            return this.$route.path + Math.random()
        }
    }
};
</script>
<style>
    .content{
        padding: 25px;
    }
</style>
