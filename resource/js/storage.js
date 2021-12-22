import Vue from 'vue'

let resolver = {
  def: 'DEFAULT',

  // 获取缓存条目，未指定 catalog 参数时，从 DEFAULT 块中获取
  get: function (entry, catalog) {
    catalog = (catalog ? catalog : this.def);
    const block = this.getCatalog(catalog);
    return block[entry];
  },

  // 保存缓存条目，未指定 catalog 参数时，保存到 DEFAULT 块
  set: function (entry, value, catalog) {
    catalog = (catalog ? catalog : this.def);

    var block = this.getCatalog(catalog);
    block[entry] = value;
    this.setCatalog(catalog, block);
  },

  // 删除缓存条目，未指定 catalog 参数时，删除 DEFAULT 块中的条目
  rm: function (entry, catalog) {
    catalog = (catalog ? catalog : this.def);
    var block = this.getCatalog(catalog);
    delete block[entry];
    this.setCatalog(catalog, block);
  },

  // 查询指定缓存目录
  getCatalog: function(catalog) {
    if (!catalog) {
      return {};
    }

    let catalogData = localStorage.getItem(catalog);

    if( !catalogData ) {
      return {};
    }
    return JSON.parse(catalogData);
  },

  // 设置指定缓存目录
  setCatalog: function (catalog, block) {
    block = block || {};

    localStorage.setItem(catalog, JSON.stringify(block)); // set catalog
  },

  // 清空指定缓存目录
  clearCatalog: function (catalog) {
    this._set(catalog, '{}'); // clear catalog
  },

  // 清空所有缓存数据
  clear: function() {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
  },

  // 查看所有缓存信息
  info: function(name) {
    try {
      const res = JSON.parse(localStorage.getItem(name));
      console.log(res)
    } catch (e) {
      console.error(e);
    }
  },
  // 内部方法：删除键值对，不建议外部调用
  _del: function (key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(e);
    }
  }
};

export default resolver;
