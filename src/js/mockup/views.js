var TodoView = Backbone.View.extend({
    model: todo_model,

    el: $("#todo_container"),

    initialize: function() {
        console.log("View initialized");
        this.$el = $('#todo-container');
        this.myFunction();
        this.render();
        this.listenTo(this.model, "change", this.render);
    },

    events: {
        "click input[type=button]": 'doSearch'
    },

    doSearch: function( event ){
        // Button clicked, you can access the element that was clicked with event.currentTarget
        console.log( "Event fired: [" + event.currentTarget + "]");
        console.log( "Search for " + $("#search_input").val() );
    },

    render: function() {
        var data = { "search_label": "This is my search" };
        console.log(data);

        var template = _.template( $("#todo_template").html() );
        this.$el.html( template(data) );

        console.log("in view: " + todo_model.toJSON());
        return this;
    },


    myFunction: function() {
        var myVar = setTimeout(this.alertFunc, 4000);
    },

    alertFunc: function() {
        console.log("After 4s, changing title");
        todo_model.set("title", "Magic! Changed title after 4s");
    }

});

// create a view for a todo
var todoView = new TodoView();

console.log(JSON.stringify(todoView));
