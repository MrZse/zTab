/*
* 1,挂载本插件只需通过new操作符调用构造函数Tab(dom,titles,contents,config),
* dom为需要挂载的dom元素，titles为标题html代码字符串列表，contents为内容html代码字符串列表,
* config中可以设置初始被选索引，title区域，content区域，滑条区域以及被选中title的类名，用于自定义样式。
* 2,添加切换钩子函数，调用addCallBacks()函数，传入的参数可以是单个函数，包含函数的数组，
* 或由逗号隔开的若干函数，或者逗号隔开的函数与包含函数的数组的组合，函数的参数中会得到被选中的项的index
* */
import {addLoadEvent, getN, getIndex, flat} from "./utils";
import classNames from 'classnames';

const Tab = (function() {
	let isCssImported = false;

	class Tab {
		constructor(dom, titles, contents, config) {
			this.titles = titles;
			this.contents = contents;// 以上两个存储用于展示的内容
			this.selectedIndex = -1;// 被选中的index
			this.callbacks = [];
			this.i = 0;
			this.config = config || {};
			if (typeof dom === 'string') {
				this.dom = document.querySelector(dom);
			} else {
				this.dom = dom;
			}// 支持选择器
			this.init();
		}

		init() {
			this.setCss("./main.css");//引入css样式
			this.dom.innerHTML = this.getElementString();
			this.titleEles = this.dom.querySelectorAll(".tab-title-item li");
			this.contentEles = this.dom.querySelectorAll(".tab-content-item li");
			this.cursor = this.dom.querySelector(".cursor");
			addLoadEvent(() => {// 此处放在onload事件内来执行是为了让滑条读取到的是真实的宽度数据
				const defaultSelectedIndex = this.config.defaultSelectedIndex || 0;
				this.setSelected(defaultSelectedIndex);// 初始化选中项为第一项
				this.implementSwitch();

				setInterval(() => {
					this.setSelected(this.i > this.contentEles.length - 2 ? this.i = 0 && 0 : ++this.i);
				},6000)
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
			return `
				<section class="tab-title ${tabTitleClassList ? classNames(tabTitleClassList) : ''}">
					<ul class="tab-title-item">
			${this.titles.map((item, index) => {
				return `<li class="li-index-${index}">${item}</li>`
			}).join('')}
					</ul>
					<div class="cursor ${classNames(cursorClass) || ""}"></div>
				</section>
				<section class="tab-content ${tabContentClassList ? classNames(tabContentClassList) : ''}">
					<ul class="tab-content-item">
			${this.contents.map(item => {
				return `<li>${item}</li>`;
			}).join('')}
					</ul>
				</section>`;
		}

		setSelected(index) {
			if (this.selectedIndex === index) {
				return;// 如果要被设为选中的索引与已选中的索引相同，则直接返回。
			}
			const { activeClass } = this.config;
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
			// 使用e.target实现事件代理
			list.addEventListener("click", e => {
				let node = e.target;
				if (node.tagName === 'UL') {
					return; // 点击空白处直接返回
				}
				while (node && node.tagName !== 'LI') {
					node = node.parentNode;// 当前元素不是li元素就往上寻找父元素
				}
				this.setSelected(getIndex(node.classList[0]));
				// e.path.some(item => {
				// 	if (item.tagName === "LI") {
				//
				// 		return true;
				// 	}
				// }); e.path有兼容性的问题
				this.callbacks.forEach(cb => {
					cb(this.selectedIndex); //点击事件触发时执行所有的callbacks并传入selectedIndex参数
				});
			});
		}

		addCallBacks(...args) {
			const arr = flat(args); // 将所有的参数全部扁平化成一个一维数组
			console.log(arr,11111);
			if (arr.some(item => {
				return typeof item !== 'function';// 如果有一个元素不是函数，那么参数错误
			})) {
				console.log('参数中含有非函数元素！');
			} else {
				this.callbacks.push(...arr);// 如果所有元素都是函数，那么添加callbacks
			}
		}
	}

	return Tab;
})();
window.Tab = Tab;



