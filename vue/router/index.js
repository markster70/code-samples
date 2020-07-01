import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '@/views/Dashboard';
import Login from '@/views/Login';
import ApplicantDetail from '@/views/ApplicantDetail';
import ApplicantCompare from '@/views/ApplicantCompare';
import ComplianceTable from '@/views/ComplianceTable';
import store from '@/store/index'
import NProgress from 'nprogress'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, hideIntakesLink : true }
  },
  {
    path: '/applicants',
    name: 'applicants',
    component: ApplicantDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/intake/:id',
    name: 'applicant-detail',
    component: ApplicantDetail,
    props: true,
    meta: { requiresAuth: true },
    beforeEnter(routeTo, routeFrom, next) {
      // set timeout here just to test slow network
      setTimeout(() => {
        store.dispatch('setCurrentIntakeItem', routeTo.params.id).then(() => {
          next()
        })
      },1500)

    }
  },
  {
    path: '/applicant-compare/:id',
    name: 'applicant-compare',
    component: ApplicantCompare,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/compliance',
    name: 'compliance',
    component: ComplianceTable,
    meta: { requiresAuth: true },
    beforeEnter(routeTo, routeFrom, next) {
      // set timeout here just to test slow network
      setTimeout(() => {
        store.dispatch('fetchComplianceInformation').then(() => {
          next()
        })
      },1500)

    }
  },

];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

export default router;

// here we're using a Navigation Guard to check whether the app is authenticated via the object stored in local storage
// this needs developing as the auth model is clearer
// if there is no logged in state set ( via a valid jwt token, we exit to login immediately.

router.beforeEach((to, from, next) => {

  // auth basic model starts here
  const loggedIn = localStorage.getItem('user');
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {

    next('/');
  } else {
    NProgress.start();
    next();
  }
});

router.afterEach(() => {
  NProgress.done();
})


