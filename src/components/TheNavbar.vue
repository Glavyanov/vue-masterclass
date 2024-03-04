<template>
  <header class="header" id="header" v-page-scroll="() => mobileNavMenu = false">
    <router-link :to="{ name: 'Home' }" class="logo">
      <img src="../assets/svg/vueschool-logo.svg" />
    </router-link>

    <div class="btn-hamburger" @click="mobileNavMenu = !mobileNavMenu"  v-backdrop="() => mobileNavMenu = false">
      <!-- use .btn-hamburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <nav class="navbar" :class="{'navbar-open': mobileNavMenu}">
      <ul>
        <li v-if="authUser" class="navbar-user">
          <a @click.prevent="userDropDownOpen = !userDropDownOpen" v-backdrop="() => userDropDownOpen = false">
            <img
              class="avatar-small"
              :src="authUser.avatar"
              :alt="`${authUser.name} profile picture`"
            />
            <span>
              {{ authUser.name }}
              <img
                class="icon-profile"
                src="../assets/svg/vueschool-logo.svg"
                alt=""
              />
            </span>
          </a>
          <div id="user-dropdown" :class="{'active-drop': userDropDownOpen}">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item"><router-link :to="{ name: 'Profile' }">View profile</router-link></li>
              <li class="dropdown-menu-item"><router-link :to="{ name: 'SignOut' }">Sign Out</router-link></li>
            </ul>
          </div>
        </li>
        <li v-if="!authUser" class="navbar-item">
          <router-link :to="{ name: 'SignIn' }">
            <span> Sign In </span>
          </router-link>
        </li>
        <li v-if="!authUser" class="navbar-item">
          <router-link :to="{ name: 'Register' }">
            <span> Register </span>
          </router-link>
        </li>
        <li v-if="authUser" class="navbar-mobile-item"><router-link :to="{ name: 'Profile' }">View profile</router-link></li>
        <li v-if="authUser" class="navbar-mobile-item"><router-link :to="{ name: 'SignOut' }">Sign Out</router-link></li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data(){
    return {
      userDropDownOpen: false,
      mobileNavMenu: false,
    }
  },
  computed: {
    ...mapGetters(["authUser"]),
  },
};
</script>
