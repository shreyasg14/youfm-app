import React, { Component } from 'react';
import { batchActions } from 'redux-batched-actions';
import { browserHistory } from 'react-router'
import classNames from 'classnames';
import {DropdownButton,MenuItem} from 'react-bootstrap';

export default class Track extends Component {
    constructor() {
        super();
        this.state = {
            showTray: 'hide',
            fav:false
        }
    }

    componentDidMount(){
        const {track} = this.props;
        this.setState({fav:(track.favourite) ? true : false})
    }

    toggleIcon(){
        this.setState({fav:!this.state.fav});
    }

    toggletray() {
        this.setState({showTray: this.state.showTray === 'show'? 'hide':'show'})
    }
    buildTray(){
        const {track, user, dispatch, instantPlay, appendtoQueue, addToQueue, addToPlaylist, toggleFavourite, toggleModal} = this.props;
        let favTitle = this.state.fav ? 'Remove from Favourite':'Add to favourites';
        let fields = [];
        fields.push(<li onClick={()=>{dispatch(instantPlay(track))}}><a>Play now</a></li>,
            <li onClick={()=>{dispatch(appendtoQueue(track))}}><a>Play next</a></li>,
            <li onClick={()=>{dispatch(addToQueue(track))}}><a>Add to queue</a></li>);
        if(user.status){
            fields.push(
                <li onClick={()=>{this.toggleIcon();dispatch(toggleFavourite(track,this.state.fav))}}><a>{favTitle}</a></li>,
                <li onClick={()=>{dispatch(toggleModal('Playlist','Add to playlist'))}}><a>Add to playlist</a></li>);
        }
        return fields;
    }

    render() {
        const {track, searchArtist, instantPlay, dispatch, location, playlistName, trackPlayNow, toggleModal, toggleFavourite, activetrack, user} = this.props;
        let playClass = (track.name === activetrack.name && track.artist === activetrack.artist && track.albumName === activetrack.albumName)? 'song__active' : 'song__play';
        let  onArtistClick = function(artist, id, type) {
            return dispatch(searchArtist(artist, id, type));
        }
        let onFavClick = function(){
            if(user.status){
                this.toggleIcon(); 
                dispatch(toggleFavourite(track,this.state.fav));
            }
            else {
                dispatch(toggleModal('FavLogin', ''));
            }
        }
        let favIcon = this.state.fav ? 'icon-heart-filled-icon':'icon-heart-empty-icon';

        return (
        <div key={track.id} className={classNames('song')} style={{width:'100%'}} onDoubleClick={()=>{dispatch(instantPlay(track))}}>
            <span className={classNames(playClass)}>
                <i className="icon-play-icon" onClick={()=> {
                    dispatch(instantPlay(track))}}>
                </i>
                <i className="icon-play-icon-small"></i>
            </span>
            <span className={classNames('song__favorite')} onClick={onFavClick.bind(this)}><i className={classNames(favIcon)}></i></span>
            <span className={classNames('song__num')}></span>
            <span className={classNames('song__art')}><img src={track.image} alt="Album Art"/></span>
            <span className={classNames('song__name')}>{track.name.replace(/&apos;/g, "'")}</span>
            <span className={classNames('song__artists')}><a style ={{color: '#FFFFFF'}} onClick={onArtistClick.bind(this, track.artist, track.artistId, 'artist')}>{track.artist}</a></span>
            {track.albumName ? <span className={classNames('song__artists')} ><a  style ={{color: '#FFFFFF'}} onClick={onArtistClick.bind(this, track.albumName, track.albumId, 'album')}>{track.albumName}</a></span>: null}
            {<span className={classNames('song__actions','open')} onClick={()=>this.toggletray()}>•••</span>
            }
            {
                this.state.showTray === 'show'? (
                    <div>
                        <ul className={classNames('dropdown-menu','dropdown-menu-right','song__actions__list')} style={{display: 'block'}}>
                            {this.buildTray()}
                        </ul>
                    </div>
                ) : null
            }
    		</div>
        );
    }
}