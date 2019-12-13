/*
* 1,挂载本插件只需通过new操作符调用构造函数Tab(dom,titles,contents,config),
* dom为需要挂载的dom元素，titles为标题html代码字符串列表，contents为内容html代码字符串列表,
* config中可以设置title区域，content区域，滑条区域以及被选中title的类名，用于自定义样式。
* 2,添加切换钩子函数，调用addCallBacks()函数，传入的参数可以是单个函数，包含函数的数组，
* 或由逗号隔开的若干函数，函数的参数中会得到被选中的项的index
* 3,调用setConfig(config)函数与构造函数时传入的一样
* */
import { addLoadEvent, getN, getIndex } from "./utils";

const Tab = (function() {
  let isCssImported = false;
  
  class Tab {
    constructor(dom, titles, contents, config) {
      this.titles = titles;
      this.contents = contents;// 以上两个存储用于展示的内容
      this.selectedIndex = -1;// 被选中的index
      this.callbacks = [];
      this.config = config || {};
      this.dom = dom;
      this.init();
    }
    
    init() {
      this.setCss("./main.css");//引入css样式
      this.dom.innerHTML = this.getElementString();
      this.titleEles = this.dom.querySelectorAll(".tab-title-item li");
      this.contentEles = this.dom.querySelectorAll(".tab-content-item li");
      this.cursor = this.dom.querySelector(".cursor");
      addLoadEvent(() => {// 此处放在onload事件内来执行是为了让滑条读取到的是真实的宽度数据
        this.setSelected(0);// 初始化选中项为第一项
        this.implementSwitch();
      });
    }
    
    setCss(url) {
      if (!isCssImported) {
        let cssFile = document.createElement("link");
        cssFile.rel = "stylesheet";
        cssFile.type = "text/css";
        cssFile.href = url;
        document.head.appendChild(cssFile);
        isCssImported = true;
      }
    }
    
    getElementString() {
      const { tabTitleClassList, cursorClass, tabContentClassList } = this.config;
      let contentString = `
				<section class="tab-title ${!!tabTitleClassList && tabTitleClassList.join(" ")}">
					<ul class="tab-title-item">`;
      this.titles.forEach((item, index) => {
        contentString += `<li class="li-index-${index}">${item}</li>`;
      });
      contentString += `
					</ul>
					<div class="cursor ${cursorClass || ""}"></div>
				</section>
				<section class="tab-content ${!!tabContentClassList && tabContentClassList.join(" ")}">
					<ul class="tab-content-item">`;
      this.contents.forEach(item => {
        contentString += `<li>${item}</li>`;
      });
      contentString += `
					</ul>
				</section>`;
      return contentString;
    }
    
    setSelected(index) {
      if (this.selectedIndex === index) {
        return;// 如果要被设为选中的索引与已选中的索引相同，则直接返回。
      }
      const { activeClass } = this.config || "";
      if (this.selectedIndex !== -1) {
        this.titleEles[this.selectedIndex].classList.remove("active", activeClass);
        this.contentEles[this.selectedIndex].classList.remove("selected");
      }// 已选索引为-1则说明此时未初始化，并没有被选中的项目，因此不必执行移除选定操作。
      
      this.titleEles[index].classList.add("active", activeClass);
      this.contentEles[index].classList.add("selected");
      getN(Array.from(this.titleEles), this.cursor, index);// 设置滑条
      this.selectedIndex = index;
    }
    
    implementSwitch() {
      const list = this.dom.querySelector(".tab-title-item");
      list.addEventListener("click", e => {
        e.path.some(item => {
          if (item.tagName === "LI") {
            this.setSelected(getIndex(item.classList[0]));
            return true;
          }
        });
        console.log(this.callbacks);
        this.callbacks.forEach(cb => {
          cb(this.selectedIndex);
        });
      });
    }
    
    addCallBacks() {
      console.log(typeof arguments[0]);
      if (arguments.length > 1) {
        if ([...arguments].every(argument => {
          return typeof argument === "function";
        })) {
          this.callbacks.push(...arguments);
        } else {
          console.log("传入的参数不正确，请传入单个函数，包含函数的数组，或由逗号隔开的若干函数！");
        }
      } else if (arguments.length === 1) {
        if (typeof arguments[0] === "function") {
          this.callbacks.push(arguments[0]);
        } else if (Array.isArray(arguments[0])) {
          if (arguments[0].every(fn => {
            return typeof fn === "function";
          })) {
            this.callbacks = this.callbacks.concat(arguments[0]);
          } else {
            console.log("传入的参数不正确，请传入单个函数，包含函数的数组，或由逗号隔开的若干函数！");
          }
        }
      }
      console.log(this.callbacks);
    }
    
    setConfig(config) {
      this.config = config;
    }
  }
  
  return Tab;
})();
window.Tab = Tab;



