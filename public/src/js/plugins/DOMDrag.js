// 
;
(function() {

		var document = window.document,
			HTML = document.documentElement;

		function extend(target, src) {
			for (var k in src) {
				src.hasOwnProperty(k) && (target[k] = src[k]);
			}
			return target;
		}

		var rSpaces = /\s+/;
		var addEvent = eventMethod('add');
		var removeEvent = eventMethod('remove');

		function eventMethod(method) {
			method += 'EventListener';
			return function(element, eventType, handleEvent, useCapture){
				useCapture = !!useCapture;
				eventType.split(rSpaces).forEach(function(eventType) {
					element[method](eventType, handleEvent, useCapture);
				})
			}
		}

		// 类构造函数
		function DOMDrag() {};

//		// 原型
//		DOMDrag.prototype = Object.create(EventEmitter.prototype, {
//			'constructor': DOMDrag
//		});
		
		// 原型（没有外部依赖）
		(function(superClass, subClass){
			var fn = function(){};
			fn.prototype = superClass.prototype;
			(subClass.prototype = new fn).constructor = subClass;
		})(EventEmitter, DOMDrag);

		// 原型扩展
		extend(DOMDrag.prototype, {

			eOriginalX: 0, // 鼠标拖拽起点x坐标
			eOriginalY: 0, // 鼠标拖拽起点y坐标
			targetOriginalX: 0, // 拖拽元素起点x坐标
			targetOriginalY: 0, // 拖拽元素起点y坐标
			eStartDragOffsetX: 0, // 开始拖拽时的鼠标x坐标偏移量
			eStartDragOffsetY: 0, // 开始拖拽时的鼠标y坐标偏移量
			eMoveX: 0, // 鼠标移动点与拖拽起点x坐标差
			eMoveY: 0, // 鼠标移动点与拖拽起点y坐标差
			targetMoveX: 0, // 被拖拽目标元素的x向移动距离
			targetMoveY: 0, // 被拖拽目标元素的y向移动距离
			limitMove: null, // 拖拽距离限制值范围（与limitRect对应dragTarget的rect自动计算出）
			root: null, // 检索是否包含拖拽目标元素的委托元素
			target: null, // 触发拖拽的目标元素
			dragTarget: null, // 拖拽目标元素（默认为target，可在'beforedrag'事件里自定义替换）
			doc: null, // 文档对象
			docRoot: null, // 文档根元素
			
			xAxialEnabled: true, // x轴向可移动
			yAxialEnabled: true, // y轴向可移动
			limitRect: null, // 被拖拽目标元素的限制范围
			
			dragTargetClass: 'dom-drag-target', // 实际被拖拽元素附加的样式
			draggingDocRootClass: 'dom-dragging', // 拖拽时文档根元素附加的样式
			dragable$: '.dom-dragable', // 匹配拖拽目标元素的样式选择器
			dragableClass: 'dom-dragable', // 拖拽目标元素的样式类
			dragdisable$: '.dom-dragdisable', // 匹配取消拖拽目标源元素的样式选择器
			dragdisableClass: 'dom-dragdisable', // 取消拖拽目标源元素的样式
			draggingPageMaskClass: 'dom-dragging-mask', // 拖拽时创建插入一个元素遮盖页面的样式

			// 初始化
			init: function init(root, options) {
				options && extend(this, options);
				//this.bindHandleEvent();
				this.initRoot(root);
				this.render();
				return this;
			},

			// 设置委托元素
			initRoot: function(root) {
				this.root = root ? typeof root === 'string' ? document.querySelector(root) || document :
					root.nodeType ? root : document : document;
				this.doc = document;
				this.docRoot = HTML;
				addEvent(this.root, 'mousedown', this);
			},

			render: function() {},

			// 事件函数统一路由
			handleEvent: function(e) {
				switch (e.type) {
					case 'mousedown':
						this.mousedown(e);
						break;
					case 'mousemove':
						this.mousemove(e);
						break;
					case 'mouseup':
						this.mouseup(e);
						break;
					default:
				}
			},

			// 事件委托在初始化的根元素上
			mousedown: function(e) {
				if (this.getTarget(e.target)) {
					e.preventDefault();
					this.initDrag(e);
					this.captureEvents();
				}
			},

			// 文档注册事件
			mousemove: function(e) {
				this.move(e);
			},

			// 文档注册事件
			mouseup: function(e) {
				this.releaseEvents();
				this.drop(e);
			},

			// 获取拖拽目标元素
			getTarget: function(target) {
				var dragable$ = this.dragable$,
					dragdisable$ = this.dragdisable$,
					root = this.root,
					docRoot = this.docRoot;

				do {
					if (target === document || target.matches(dragdisable$)) {
						return ;
					}
					if (target.matches(dragable$)) {
						return this.target = target;
					}
				}
				while (target !== root && (target = target.parentNode));
			},

			// 获取遮罩元素
			getMaskLayer: function(setClass) {
				if (!DOMDrag._maskLayer) {
					DOMDrag._maskLayer = document.createElement('div');
					setClass = true;
				}
				if (setClass) {
					DOMDrag._maskLayer.className = this.draggingPageMaskClass;
				}
				return DOMDrag._maskLayer;
			},

			// 遮罩页面
			maskPage: function() {
				document.body.appendChild(this.getMaskLayer(true));
			},

			// 撤销遮罩页面
			unmaskPage: function() {
				document.body.removeChild(this.getMaskLayer());
			},

			// 初始化拖拽
			initDrag: function(e) {
				var currentStyle,
					top,
					left, 
					dragTargetRect;
					
				this.event = e;
				this.dragTarget = this.target;
				
				this.emit('beforedrag', e);
				
				this.eOriginalX = e.screenX;
				this.eOriginalY = e.screenY;
				
				this.docRoot.classList.add(this.draggingDocRootClass);
				
				if(this.dragTarget){
					
					this.dragTarget.classList.add(this.dragTargetClass);
					
					currentStyle = getComputedStyle(this.dragTarget);
					top = parseInt(currentStyle.top) || 0;
					left = parseInt(currentStyle.left) || 0;
					
					this.originalRect = this.target.getBoundingClientRect();
					dragTargetRect = this.dragTarget.getBoundingClientRect();
					
					this.targetStyle = this.dragTarget.style;
					this.targetStyle.top = (this.targetOriginalY = this.originalRect.top - dragTargetRect.top + top) + 'px';
					this.targetStyle.left = (this.targetOriginalX = this.originalRect.left - dragTargetRect.left + left) + 'px';
				
					if(this.limitRect){
						dragTargetRect = this.dragTarget.getBoundingClientRect();
						this.limitMove = {};
						// x轴向可移动
						if(this.xAxialEnabled){
							this.limitMove.right = this.limitRect.right - dragTargetRect.right;
							this.limitMove.left = this.limitRect.left - dragTargetRect.left;
						}
						// y轴向可移动
						if(this.yAxialEnabled){
							this.limitMove.top = this.limitRect.top - dragTargetRect.top;
							this.limitMove.bottom = this.limitRect.bottom - dragTargetRect.bottom;
						}
					}
				}
				
				this.maskPage();
				addEvent(document, 'mousemove mouseup', this);
			},

			// 鼠标移动
			move: function(e) {
				if (Math.abs(e.screenX - this.eOriginalX) > this.eStartDragOffsetX || Math.abs(e.screenY - this.eOriginalY) > this.eStartDragOffsetY) {
					this.startdrag(e);
				}
			},

			// 开始拖拽事件
			startdrag: function(e) {
				this.event = e;
				this.emit('startdrag', e);
				this.move = this.dragging; // 方法move切换到dragging
				this.move(e);
			},

			// 拖拽中
			dragging: function(e) {
				var moveX = this.eMoveX = e.screenX - this.eOriginalX,
					moveY = this.eMoveY = e.screenY - this.eOriginalY;
					
				if(this.targetStyle){
					// x轴向可移动
					if(this.xAxialEnabled){
						if(this.limitMove){
							moveX = moveX < this.limitMove.left ? this.limitMove.left : moveX > this.limitMove.right ? this.limitMove.right : moveX;
						}
						this.targetLeft = this.targetStyle.left = this.targetOriginalX + (this.targetMoveX = moveX) + 'px';
					}
					// y轴向可移动
					if(this.yAxialEnabled){
						if(this.limitMove){
							moveY = moveY < this.limitMove.top  ? this.limitMove.top : moveY > this.limitMove.bottom ? this.limitMove.bottom : moveY;
						}
						this.targetTop = this.targetStyle.top = this.targetOriginalY + (this.targetMoveY = moveY) + 'px';
					}
				}
				this.event = e;
				this.emit('dragging', e);
			},

			// 鼠标松开
			drop: function(e) {
				this.event = e;
				this.emit('drop', e);
				removeEvent(document, 'mousemove mouseup', this);
				if(this.dragTarget){
					this.dragTarget.classList.remove(this.dragTargetClass);
				}
				this.docRoot.classList.remove(this.draggingDocRootClass);
				this.unmaskPage();
				this.reset();
			},

			// 重置所有属性
			reset: function(e) {
				delete this.event;
				delete this.move;
				delete this.target;
				delete this.dragTarget;
				delete this.targetStyle;
				delete this.eOriginalX;
				delete this.eOriginalY;
				delete this.originalRect;
				delete this.targetOriginalX;
				delete this.targetOriginalY;
				delete this.targetLeft;
				delete this.targetTop;
				delete this.eMoveX;
				delete this.eMoveY;
				delete this.targetMoveX;
				delete this.targetMoveY;
				delete this.limitRect;
				delete this.limitMove;
			},

			// 检测鼠标是否在某个矩形范围内（相对于视口view，不是page）
			isEnterRect: function(rect) {
				return DOMDrag.isEnterRect(rect, this.event.clientX, this.event.clientY);
			},

			// 捕获事件
			captureEvents: function() {
				window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
			},

			// 释放事件
			releaseEvents: function() {
				window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
			}
		});

		// 静态成员
		extend(DOMDrag, {
			//
			create: function(root, options) {
				return new DOMDrag().init(root, options);
			},
			
			// 检测一个坐标点x, y是否在某个矩形范围内
			isEnterRect: function(rect, x, y) {
				x || (x = 0);
				y || (y = 0);
				return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
			},
			
			// 检测一个坐标点x, y是否在某个元素矩形范围内
			isEnterElement: function(element, x, y) {
				var rect = element.getBoundingClientRect();
				return DOMDrag.isEnterElement(rect);
			}
		});
		
	var exports = this;
	
	// Expose the class either via AMD, CommonJS or the global object
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return DOMDrag;
		});
	} else if (typeof module === 'object' && module.exports) {
		module.exports = DOMDrag;
	} else {
		exports.DOMDrag = DOMDrag;
	}

}.call(this));