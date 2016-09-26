import React from 'react';
import {connect} from 'react-redux';
import {VelocityTransitionGroup} from 'velocity-react';

import fetchResults from '~/search/common/actions/results/fetch-results';
import setSort from '~/search/common/actions/criteria/sort';
import {searchSort, getSearchSort} from '~/common/lang/search-sort';

//velocity animations
const animationSlideDownQuick = {
    animation: "slideDown",
    duration:150
};

const animationSlideUpQuick = {
    animation: "slideUp",
    duration: 100
};

const SortMenu = React.createClass({

    bodyClickCloseTimer: null,

    getInitialState() {
        return {isOpen: false};
    },

    componentDidMount: function () {
        document.body.addEventListener('click', this.handleBodyClick);
    },

    componentWillUnmount: function () {
        document.body.removeEventListener('click', this.handleBodyClick);
        if (this.bodyClickCloseTimer) {
            clearTimeout(this.bodyClickCloseTimer);
        }
    },

    // For closing menu when clicking anywhere on the document.
    handleBodyClick(e) {
        if (this.state.isOpen) {
            // Need setTimeout so if clicking on the menu to close, it doesn't reopen in handleMenuClick which also is firing.
            this.bodyClickCloseTimer = setTimeout(() => {
                this.setState({isOpen: false});
            }, 60);
        }
    },

    // For opening menu when clicking on menu.
    handleMenuClick(e) {
        // stopPropagation to prevent body click event handler (handleBodyClick) from firing.
        e.stopPropagation();
        if (! this.state.isOpen) {
            this.setState({isOpen: true});
        }
    },

    handleSelectionClick(sort) {
        this.setState({isOpen:false});
        this.props.dispatch(setSort(sort));
        this.props.dispatch(fetchResults());
    },

    renderOptions() {
        if (this.state.isOpen) {
            var {sort, postal} = this.props;
            var optionsIndex = [...searchSort.index];

            if (! postal) {
                // Remove "distance" as a sort option.
                const index = optionsIndex.indexOf('distance');
                if (index !== -1) {
                    optionsIndex.splice(index, 1);
                }
            }

            const options = optionsIndex.map((key) => {
                sort = (sort || searchSort.index[0]); // handle null sort
                const value = getSearchSort(key);
                const className = (sort === key) ? "current" : null;
                return (
                    <li key={key} className={className} onClick={this.handleSelectionClick.bind(this, key)}>
                        {value}
                    </li>
                )
            });

            return (
                <ul>
                    {options}
                </ul>
            )
        }
    },

    renderSelected() {
        const className = (this.state.isOpen) ? "selected on" : "selected";
        const {sort} = this.props;

        return (
            <div className={className} onClick={this.handleMenuClick}>{getSearchSort(sort)}</div>
        )
    },

    render() {
        return (
            <div className="selectMenu">
                {this.renderSelected()}
                <VelocityTransitionGroup enter={animationSlideDownQuick} leave={animationSlideUpQuick}>
                    {this.renderOptions()}
                </VelocityTransitionGroup>
            </div>
        )
    }
});

function mapStateToProps(state) {
    return {
        sort: state.criteria.sort,
        postal: state.criteria.postal
    }
}

export default connect(mapStateToProps)(SortMenu);