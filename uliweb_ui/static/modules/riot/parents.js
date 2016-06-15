riot.mixin({
  parents: function (tagName) {
     var p = this.parent;

     tagName = tagName.toUpperCase();

     while (p != undefined && p.root.tagName != tagName) {
       p = p.parent;
     }

     return p;
  }
});
