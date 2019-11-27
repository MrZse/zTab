/*
* 1,挂载本插件只需通过new操作符调用构造函数Tab(dom,item,content),
* dom为需要挂载的dom元素，item为标题列表字符串数组，content为内容html代码字符串列表
* 2,添加切换钩子函数，调用addCallBacks(fn)函数，fn为传入的需要执行的函数，函数的参数中会得到被选中的项的index
* 3,调用setConfig(config)函数用于配置组件的样式,
* 函数的参数为config对象,支持的属性有
* cursorColor:'#f900ff',
* activeColor:'#f900ff',
* titleBackGroundColor: '#ffffae',
* contentBackGroundColor:'#ffffae',
* font:{
* 	size: 20,
* 	font: 'consolas',
* 	color: '#ff003a'
* 	}
* */

const Tab = (function(){
	/*以下为闭包中存放的私有变量*/
	let id = 0;
	/*以上为闭包中存放的私有变量*/

	class Tab{
		constructor(dom,item,content){
			this.itemList = item;
			this.contentList = content;
			this.selectedIndex = 0;
			this.callBacks= [];
			this.cursor = null;
			this.contents = [];
			this.titles = [];
			this.id = id;
			this.init(dom);
		}

		//初始化函数，用于挂载
		init(dom){
			this.setCss('main.css');//引入css样式
			let mydiv = document.createElement('div');
			mydiv.innerHTML = this.getElementString();
			dom.appendChild(mydiv);//增加元素
			this.addLoadEvent(()=>{
				this.setCursorAndItem();
				this.getN(this.titles,this.cursor,0);
			});
			id++;
		}

		/*以下为init函数中所用到的函数*/

		addLoadEvent(func){
			var oldonload=window.onload;
			if(typeof window.onload!='function'){
				window.onload=func;
			}else{
				window.onload=function(){
					oldonload();
					func();
				}
			}
		}
		//得到模板的代码字符串
		getElementString(){
			var	contentString = `
				<section class="tab-title" id="tab-title-${this.id}">
					<ul id="tab-title-item-${this.id}" class="tab-title-item">`;
			this.itemList.forEach(item=>{
				contentString+=`<li>${item}</li>`
			});
			contentString += `
					</ul>
					<div id="cursor-${this.id}" class="cursor"></div>
				</section>
				<section class="tab-content" id="tab-content-${this.id}">
					<ul id="tab-content-item-${this.id}" class="tab-content-item">`;
			this.contentList.forEach(item=>{
				contentString += `<li>${item}</li>`;
			})
			contentString += `
					</ul>
				</section>`;
			return contentString
		}

		//添加css文件
		setCss(url){
			if(this.id===0){
				var cssFile = document.createElement('link');
				cssFile.rel = 'stylesheet';
				cssFile.type = 'text/css';
				cssFile.href = url;
				document.head.appendChild(cssFile);
			}
		}

		//为滑条添加功能并实现切换功能
		setCursorAndItem(){
			//获取各个dom元素
			this.cursor = document.querySelector('#cursor-'+this.id);
			this.titles = document.querySelectorAll('#tab-title-item-'+this.id+' li');
			this.contents = document.querySelectorAll('#tab-content-item-'+this.id+' li');
			//设置第一项为选中项
			this.titles[0].classList.add('active','active-'+this.id);
			this.contents[0].classList.add('selected');

			//为每一项标题添加点击事件
			var list = document.querySelector('#tab-title-item-'+this.id);
			list.addEventListener('click',(e)=>{
				let index = Array.from(this.titles).indexOf(e.target);
				if(index !== this.selectedIndex && index !== -1){
					this.getN(this.titles,this.cursor,index);//设置下滑条的宽度与位置
					this.titles[this.selectedIndex].classList.remove('active','active-'+this.id);
					this.contents[this.selectedIndex].classList.remove('selected');//去掉已选中的项目
					e.target.classList.add('active','active-'+this.id);//使本项为选中项
					this.selectedIndex = index;//修改被选中项索引
					this.contents[this.selectedIndex].classList.add('selected');
					let content = document.querySelector('#tab-content-'+this.id);
					content.style.height = '';
					console.log(content.offsetHeight);
					if(content.offsetHeight < 500){
						content.style.height = 500+'px';
					}
					//执行所有的钩子函数
					this.callBacks.forEach(item=>{
						item(this.selectedIndex);
					})
				}
			});
		}

		//下方函数用于动态设置cursor的长度
		getN(arr,node,n){
			node.style.width = arr[n].offsetWidth+'px';
			let sum = 20;
			arr.forEach((item,index)=>{
				if(index < n){
					sum += item.offsetWidth+16;
				}
			});
			node.style.left = sum+'px';
		}

		/*以上为init函数中所用到的函数*/

		/*以下为暴露出来的api供开发者使用*/

		//添加回调函数
		addCallBacks(fn){
			this.callBacks.push(fn);
		}

		//config函数用于配置各项属性
		setConfig(config){
			if(config.cursorColor){
				this.setCursorColor(config.cursorColor)
			}
			if(config.activeColor){
				this.setActiveColor(config.activeColor)
			}
			if(config.titleBackGroundColor){
				this.setTitleBackGroundColor(config.titleBackGroundColor)
			}
			if(config.contentBackGroundColor){
				this.setContentBackGroundColor(config.contentBackGroundColor)
			}
			if(config.font){
				this.setFont(config.font)
			}
			//设置标题字体大小
		}
		setCursorColor(color){
			var cssFile = document.createElement('style');
			cssFile.innerHTML = `
			#cursor-${this.id}{
				background: ${color};
			}`;
			document.head.appendChild(cssFile);
		}//设置滑条颜色
		setActiveColor(color){
			var cssFile = document.createElement('style');
			cssFile.innerHTML = `
			.active-${this.id}{
				color: ${color};
			}`;
			document.head.appendChild(cssFile);
		}//设置选中标题的颜色
		setTitleBackGroundColor(color){
			var cssFile = document.createElement('style');
			cssFile.innerHTML = `
			#tab-title-${this.id}{
				background: ${color};
			}`;
			document.head.appendChild(cssFile);
		}//设置标题背景颜色
		setContentBackGroundColor(color){
			var cssFile = document.createElement('style');
			cssFile.innerHTML = `
			#tab-content-${this.id}{
				background: ${color};
			}`;
			document.head.appendChild(cssFile);
		}//设置内容背景颜色
		setFont(font){
			var cssFile = document.createElement('style');
			cssFile.innerHTML = `
			#tab-title-${this.id}{
				font-size: ${font.size}px;
				font-family: ${font.font};
				color: ${font.color};
			}`;
			document.head.appendChild(cssFile);
		}//设置字体

		/*以上为暴露出来的api供开发者使用*/
	}
	return Tab;
})();




