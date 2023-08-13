import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    /**
     * User token
     */
    token: null as null | string,

    /**
     * User data
     */
    userData: null as null | object,
	
    /**
     * User permissions
     */
    permissions: null as null | Array<string>,
	
    /**
     * Determinate user is logged
     */
    isAuthenticated: false,
  }),
  actions: {
    /**
     * Check user Authentication
     */
    checkAuth() {
      const getUserToken = localStorage.getItem("token");

      if (getUserToken) {
        this.token = getUserToken;
		
        if (localStorage.getItem("user_data")) {
          this.userData = JSON.parse(
            localStorage.getItem("user_data") as string
          );
        }
		
		const getPermissions = localStorage.getItem("permissions");
        if(getPermissions){
          this.permissions = getPermissions.split(",");
        }
		
        this.isAuthenticated = true;
      } else {
        this.token = null;
        this.userData = null;
		this.permissions = null;
        this.isAuthenticated = false;
      }
    },
	/**
     * Check user has permission by key
     * @param permissionKey 
     * @returns 
     */
    hasPermission(permissionKey: string) {
      let result = false;

      try {
        if(this.permissions){
          result = this.permissions.indexOf(permissionKey) >= 0;
        }
      } catch (e) {
        result = false;
      }

      return result;
    },
    /**
     * Logout user
     */
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user_data");
      localStorage.removeItem("permissions");
      this.checkAuth();
    },
  },
});
