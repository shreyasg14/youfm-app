import React, { Component, PropTypes } from 'react';
import SideBar from './SideBar';
import Player from './Player';
import Search from './Search';
import AppModal from './AppModal'
import classNames from 'classNames';
export default class App extends Component {

  componentDidUpdate(){
      this.checkForPlayerID();
  } 

  componentDidMount(){
    const {dispatch,isSearchSync, getSpotifySearch} = this.props;
    this.checkForPlayerID();
    isSearchSync ? dispatch(getSpotifySearch(isSearchSync)) : null;
  }

  checkForPlayerID(){
    const {dispatch,inSync,playerPlay, playerHasBooted,bootPlayer, isSearchSync, getSpotifySearch} = this.props;
    inSync ? dispatch(playerPlay(inSync)) : null;
    !playerHasBooted ? dispatch(bootPlayer(inSync)): null;
  }

  render() {
    const {children, store, showLogin} = this.props;
    return (
      <div className = {classNames('rails')}>
        <div className={classNames('rail', 'rail--left')}>
          <SideBar {...this.props} />
        </div>
        <div className={classNames('rail', 'rail--center')}>
          <Search {...this.props}/>
          {showLogin ? null : children } 
          <Player {...this.props} />   
        </div>
        <AppModal {...this.props}>
					{children ? React.cloneElement(children, {store}): null}
			  </AppModal>
      </div>
    );
  }
}