import { createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const routes = [
	{
		path: "/", // http://localhost:5173
		component: () => import("../views/VerticalNavigation.vue"),
		redirect: "/index",
		children: [
			{
				path: "index",
				component: () => import("../views/index.vue")
			},
			{
				path: "person",
				component: () => import("../views/person.vue")
			},
			{
				path: "shopping",
				component: () => import("../views/shopping.vue")
			},
			{
				path: "others",
				component: () => import("../views/others.vue")
			},
			{
				path: "user",
				component: () => import("../views/User.vue")
			},
			{
				path: "add",
				component: () => import("../views/UserAdd.vue")
			},
		]
	},
	{
		path: "/login", // http://localhost:5173/login
		component: () => import("../views/login.vue")
	},
]

const router = createRouter({
	//使用url的#符号之后的部分模拟url路径的变化,因为不会触发页面刷新,所以不需要服务端支持
	//history: createWebHashHistory(), 
	history: createWebHistory(),
	routes
})

export default router