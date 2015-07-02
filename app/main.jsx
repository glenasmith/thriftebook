
var Book = React.createClass({

    render: function() {

        return (<tr>
                <td><img src={"/api/deals/image/" + this.props.deal._id} className="deal-image"/></td>
                <td><a href={ this.props.deal.link }>{this.props.deal.title}</a></td>
                <td>{this.props.deal.vendor}</td>
                <td>{this.props.deal.text}</td>
            </tr>
        );


    }

});

var Books = React.createClass({

    getInitialState: function() {
        return (
        { }
        );
    },

    componentDidMount: function() {
        reqwest('/api/deals/current', function (deals) {

            this.state = {
                deals: deals,
                date: moment().startOf('day').toDate()
            };
            if (this.isMounted()) {
                console.log(this.state);
                this.setState(this.state);
            }
        }.bind(this));
    },

    render: function() {
        var books = [];
        _.forEach(this.state.deals, function(deal) {
            books.push(
                <Book deal={deal}/>
            );
        });
        return (
                <div class="well">
            <table class="row row-striped" class="deals-table">
                <thead>
                <tr>
                    <th>Cover</th>
                    <th>Title</th>
                    <th>Vendor</th>
                    <th>Deal Info</th>
                </tr>
                </thead>
                <tbody>
                {books}
                </tbody>

                </table>
                </div>
        );

    }

});

React.render(<Books />, document.getElementById("books"));
