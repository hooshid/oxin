import { defineStore } from "pinia";

export const useAppStore = defineStore({
  id: "app",
  state: () => ({
    notification: {
      show: false,
      text: "",
      color: "red",
      timeout: 0,
    },
    loading: false,
    layout: {
      isDarkTheme: false,
      cardType: "shadow" as "shadow" | "border",
      isSidebarDrawerTemporary: false,
      isHorizontalLayout: false,
      isBoxed: false,
    },
  }),
  actions: {
    notification(payload: {
      action?: "success" | "error";
      color?: string;
      message?: string;
      timeout?: number;
      debug?: object;
    }) {
      let log = true;
      // Error response from axios
      const error = payload.debug as {
        response: {
          status: number;
          payload: string;
          headers: string;
          data: {
            result: {
              [key: string]: string;
            };
          };
        };
        request: object;
        message: string;
      };

      // Reset
      this.$state.notification.show = false;
      this.$state.notification.timeout = 0;

      // Vars
      let color = "primary";
      let text: string | undefined = "";
      let timeout = 0;

      setTimeout(() => {
        if (payload.action === "success") {
          color = "green";
          text = "عملیات با موفقیت انجام شد.";
          timeout = 3000;
        } else if (payload.action === "error") {
          color = "red";
          text = "درخواست شما انجام نشد، دوباره امتحان کنید.";
          timeout = 4000;

          if (error.response?.status === 404) {
            text =
              "آیتم مورد نظر شما پیدا نشد یا قبلا وجود داشته و اکنون حذف شده است.";
            log = false;
          } else if (error.response?.status === 403) {
            text = "شما به این بخش دسترسی ندارید.";
            log = false;
          } else if (error.response?.status === 422) {
            let errorText = null;
            /*
            Object.keys(error.response.data.errors).forEach((itemKey) => {
              Object.keys(error.response.data.errors[itemKey]).forEach(
                (key) => {
                  if (errorText === null) {
                    errorText = error.response.data.errors[itemKey][key];
                  }
                }
              );
            });
            */

            if (error.response.data?.result?.message) {
              errorText = error.response.data.result.message;
            } else if (error.response.data?.result?.description) {
              errorText = error.response.data.result.description;
            } else if (error.response.data?.message) {
              errorText = error.response.data.message;
            }

            if (errorText === null) {
              errorText = "عملیات انجام نشد.";
            }

            text = errorText;
            timeout = 6000;
            log = false;
          } else if (error.response?.status === 500) {
            let errorText = null;

            if (error.response.data?.result?.message) {
              errorText = error.response.data.result.message;
            }

            if (errorText === null) {
              errorText = "خطایی در سمت سرور رخ داده است.";
            }

            text = errorText;
            timeout = 6000;
            log = false;
          } else if (error.response?.status === 401) {
            text = "از سیستم خارج شدید.";
            // this.commit("app/logout", "/login");
            //this.$state.isCmsModulesLoaded = false;
            //this.$state.isAuthenticated = false;
            //this.$state.user = null;
            localStorage.clear();
            location.reload();

            log = false;
          }
        } else {
          color = payload.color || "primary";
          text = payload.message;
          timeout = payload.timeout || 3000;
        }

        // create snackbar message
        if (text) {
          this.$state.notification = {
            show: true,
            color,
            text,
            timeout,
          };
        }

        if (payload.debug && log) {
          // Error 😨
          if (error.response) {
            /*
             * The request was made and the server responded with a
             * status code that falls out of the range of 2xx
             */
            // eslint-disable-next-line no-console
            console.log(error.response.payload);
            // eslint-disable-next-line no-console
            console.log(error.response.status);
            // eslint-disable-next-line no-console
            console.log(error.response.headers);
          } else if (error.request) {
            /*
             * The request was made but no response was received, `error.request`
             * is an instance of XMLHttpRequest in the browser and an instance
             * of http.ClientRequest in Node.js
             */
            // eslint-disable-next-line no-console
            console.log(error.request);
          } else {
            // Something happened in setting up the request and triggered an Error
            // eslint-disable-next-line no-console
            console.log("Error", error.message);
          }
          // console.log(error);
        }
      }, 50);
    },
  },
});
