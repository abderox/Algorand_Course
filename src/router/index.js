import Vue from "vue";
import VueRouter from "vue-router";

const homeView = () => import("../views/HomeView.vue");
const walletDemoView = () => import("../views/WalletDemoView.vue");

Vue.use(VueRouter);
const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            component: homeView,
            name: "home",
        },
        {
            path: "/wallet-demo",
            component: walletDemoView,
            name: "walletDemo",
        },
    ],
});

export default router;
