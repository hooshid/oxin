import { defineStore } from "pinia";
import MasterPage from "../views/page-builder/MasterPage.vue";
import http from "@/plugins/http";
import router from "@/router";
import { buildTree } from "@/plugins/functions";
import { pascalCase, snakeCase } from "change-case";

interface Sender {
  title: string;
  url: string;
  children: Array<object>;
}

/**
 * Vue components in folder modules
 */
let modules: Record<string, () => Promise<unknown>> | null = null;

export const useModuleStore = defineStore("module", {
  state: () => ({
    /**
     * Determinate modules is loaded
     */
    isModulesLoaded: false,

    /**
     * List of modules loaded from server
     */
    modulesOriginal: [],

    /**
     * List of modules as Tree
     */
    modules: [] as unknown,
  }),
  actions: {
    async getModulesAsync() {
      try {
        await http
          .get("/base/modules/modules/get")
          .then((response) => {
            // Glob vue components as modules to register routes
            modules = import.meta.glob("@/modules/*/*.vue");

            // Deep clone -> not reference to data.response any more
            this.modules = buildTree(
              JSON.parse(JSON.stringify(response.data.data)),
              "id",
              "parent_id"
            ) as unknown;

            this.createMenu({
              sender: this.modules as Array<Sender>,
              prefixUrl: "",
            });

            this.modulesOriginal = response.data.data;
            this.isModulesLoaded = true;
          })
          .catch(function () {
            alert("اطلاعات فرم ها لود نشد!");
            return false;
          });
      } catch (error) {
        return error;
      }
    },

    createMenu(payload: { sender: Array<Sender>; prefixUrl: string }) {
      let prefixUrl = "";
      if (payload.prefixUrl) {
        prefixUrl = payload.prefixUrl;
      }

      payload.sender.forEach((curMenuItem) => {
        let meta;
        if (curMenuItem) {
          meta = curMenuItem;
        }

        const route = prefixUrl + "/" + curMenuItem.url;
        const name = snakeCase(route);

        if (router.hasRoute(name)) {
          const l = router.resolve({ path: route });

          if (!l.matched[0].meta.title) {
            l.matched[0].meta.title = meta?.title;
          }

          if (!l.matched[0].meta.module) {
            l.matched[0].meta.module = meta;
          }
        } else {
          const ModuleName = pascalCase(prefixUrl.substring(1).split("/")[0]);
          const ComponentName = pascalCase(curMenuItem.url);
          let Component = null;

          if (modules) {
            Component = modules[`@/modules/${ModuleName}/${ComponentName}.vue`];
          }

          // if has children
          if (meta && curMenuItem.children) {
            router.addRoute({
              path: prefixUrl + "/" + curMenuItem.url,
              component: () => import("../views/NavigationRoutes.vue"),
              name,
              meta: {
                title: meta?.title,
                module: meta,
              },
            });
          }
          // if has component in modules folder
          else if (meta && Component) {
            router.addRoute({
              path: prefixUrl + "/" + curMenuItem.url,
              component: Component,
              name,
              meta: {
                title: meta?.title,
                module: meta,
              },
            });
          }
          // not specific component going to MasterPage
          else {
            router.addRoute({
              path: prefixUrl + "/" + curMenuItem.url,
              component: MasterPage,
              name,
              meta: {
                title: meta?.title,
                module: meta,
              },
            });
          }
        }

        if (curMenuItem.children != null) {
          this.createMenu({
            sender: curMenuItem.children as Array<Sender>,
            prefixUrl: prefixUrl + "/" + curMenuItem.url,
          });
        }
      });
    },
  },
});
