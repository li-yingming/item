class List {
  constructor() {
    this.getData();
    this.bindEve();
    //默认页码
    this.currentPage = 1;
  }
  //绑定事件的方法
  bindEve() {
    //给ul绑定点击事件 
    this.$('.ph_hd ul').addEventListener('click', this.checkLogin.bind(this))
    //滚动条事件
    window.addEventListener('scroll', this.lazyLoader)
  }
  /******获取数据*****/
  async getData(page = 1) {
    // console.log(123);
    //发送ajax 请求获取数据 
    //await 等待后面的promise解包完成 拿到最后的结果 (不用then)
    let { status, data } = await axios.get('http://localhost:8888/goods/list?current=' + page)
    // console.log(goodsData);
    // console.log(status, data);
    // 2判断请求对的转态是否成功 
    if (status != 200 && data.code != 1) throw new Error('数据没有获取到')

    //3 循环渲染数据 ,追加到页面
    let html = '';
    data.list.forEach(goods => {
      // console.log(goods);

      html +=
        `       <li class="sk_goods"data-id="${goods.goods_id}">
      <div class="con_hb"><a href="./detail.html"><img src="${goods.img_big_logo}" alt=""></a></div>
      <h5 class="con_txt"><a href="#none">${goods.title}
      </h5>
      <div class="con_mn"><a href="#none" class="style_red">￥<em>${goods.current_price}</em></a><s>&nbsp;${goods.price}</s>
      </div>
      <div class="con_xl"><a href="#none">${goods.sale_type}
              <div class="xl_big">
                  <div class="xl_small"></div>
              </div>
              剩余<i class="style_red">29</i>件
          </a>
      </div>
      <a href="#none" class="con_btn">立即抢购</a>
  </li>`

    });
    // console.log(html);
    //将拼接好的字符串,追加到ul中 
    // console.log(this.$('.sk_bd ul'));
    this.$('.ph_hd ul').innerHTML = html;
  }

  /*******加入购物车*******/
  //检查是否登录
  checkLogin(eve) {
    // console.log(this);
    //获取事件源,判断点击的是否为a标签
    // console.log(eve.target.calssList);
    if (eve.target.nodeName != 'A' || eve.target.className != 'con_btn') return
    // console.log(eve.target);
    //判断用户是否登录,如果local中有token 表示登录,没有则表示未登录 
    let token = localStorage.getItem('token');
    // console.log(token);
    //没有token未登录 ,跳转到登录页面 
    if (!token) location.assign('./login.html?ReturnUrl=./list.html');
    //如果用户登录,商品加入购物车
    //获取商品和用户id
    let goodsId = eve.target.parentNode.dataset.id;
    // console.log(goodsId);
    let userId = localStorage.getItem('user_id')
    this.addCartGoods(goodsId, userId)

  }
  addCartGoods(gId, uId) {
    // console.log(gId, uId);
    //给添加购物车接口发送请求 
    const AUTH_TOKEN = localStorage.getItem('token')
    axios.defaults.headers.common['authorization'] = AUTH_TOKEN;
    axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    let param = `id=${uId}&goodsId=${gId}`
    axios.post('http://localhost:8888/cart/add', param).then(({ data, status }) => {
      console.log(data, status);
      //判断添加购物车是否成功
      if (status == 200 && data.code == 1) {
        layer.open({
          title: '商品添加成功'
          , content: '去购物车查看商品吗???'
          , btn: ['留下', '去购']
          , btn2: function (index, layero) {
            //按钮【按钮二】的回调
            // console.log('去购物车了');
            location.assign('./settle.html')
          }
        });
      } else if (status == 200 && data.code == 0) {
        //清除local 中token 和 userID
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')
        //跳转到登录页面
        location.assign('./login.html?ReturnUrl=./list.html')

      } else {
        layer.open({
          title: '失败提示框'
          , content: '商品添加失败!!!'
          , time: 3000
        });

      }

    })
  }
  //懒加载 
  lazyLoader = () => {
    //需要滚动条高度,可视区高度,实际内容高度 
    let top = document.documentElement.scrollTop;  //滚动条
    // console.log(top);
    let cliH = document.documentElement.clientHeight; //可视区
    // console.log(cliH);
    let conH = this.$('.content').offsetHeight; //实际内容
    // console.log(conH);
    // 当滚动条的高度+可视区的高度>实际内容高度时,就加在数据 
    if (top + cliH > (conH + 300)) {
      //一瞬间就满足条件,会不停的触发数据加在,使用节流和防抖
      // console.log(111);
      // 如果是锁着的 ,就结束代码执行
      if (this.lock) return
      this.lock = true;
      //指定时间开锁 
      setTimeout(() => {
        this.lock = false;
      }, 2000)
      this.getData(++this.currentPage)

    }

  }
  //封装获取节点的方法  
  $(tar) {
    let res = document.querySelectorAll(tar)
    return res.length == 1 ? res[0] : res;
  }
}
new List;
