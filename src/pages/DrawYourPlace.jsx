// @flow

import React, { Fragment } from 'react';
import type { Meuble } from '../types/Meubles';

type State = {
    mesMeubles: Meuble[],
    adaptedValue: Number,
    selectedMeuble: Number,
    myPlace: Meuble,
    newMeuble: Meuble,
    action: string,
    isFollowing: boolean,
    myPlaceIsCreated: boolean,
    focus: boolean,
}
export default class DrawYourPlace extends React.Component<Props> {
    state = {
        action: 'CREATE',
        adaptedValue: 0,
        mesMeubles: [],
        selectedMeuble: 0,
        myPlace: this.props.myPlace,
        newMeuble: {posX: 0, posY: 0, angle: 0, color: '', name: ''},
        isFollowing: false,
        myPlaceIsCreated: false,
        focus: false,
    }
    componentDidMount() {
        if (this.state.myPlace.long >= this.state.myPlace.larg) {
            this.setState({adaptedValue: this.state.myPlace.larg * this.myPlaceRef.offsetWidth / this.state.myPlace.long })
        } else {
            this.setState({adaptedValue: this.state.myPlace.long * this.myPlaceRef.offsetHeight / this.state.myPlace.larg })
        }

        window.addEventListener('keydown',this.handleArrow)
    }

    addMeuble = () => {
        const newMeuble = {
            ...this.state.newMeuble,
            posX: 0,
            posY: 0,
            color: '',
            name: '',
            angle: 0,
        }

        this.setState({
            mesMeubles: [...this.state.mesMeubles, newMeuble],
            newMeuble: {
                posX: 0,
                posY: 0,
                larg: 0,
                long: 0,
                color: '',
                name: '',
                angle: 0,
            }
        }, () => this.setState({selectedMeuble: this.state.mesMeubles.length - 1}));
    }

    componentWillUpdate = (nextProps, nextState) => {
        if(this.state.isFollowing !== nextState.isFollowing ) {
            this.toggleFollowing(nextState.isFollowing);
        }
    };

    toggleFollowing = (isEnable) => {
        if (isEnable) {
            window.addEventListener('mousemove', this.follow);
            window.addEventListener('mouseup', this.stopFollow);
        } else {
            window.removeEventListener('mousemove', this.follow);
        }
    };

    follow = (event) => {
        console.log(this.convertSizeHeight(this.state.mesMeubles[this.state.selectedMeuble].larg),100 , this.myPlaceRef.offsetTop)
        this.updateMesMeubles(event.clientX - this.myPlaceRef.offsetLeft - (this.convertSizeWidth(this.state.mesMeubles[this.state.selectedMeuble].long)/100 * this.myPlaceRef.offsetWidth) / 2, 'posX')
        this.updateMesMeubles(event.clientY - this.myPlaceRef.offsetTop - (this.convertSizeHeight(this.state.mesMeubles[this.state.selectedMeuble].larg)/100 * this.myPlaceRef.offsetHeight) / 2, 'posY')
    };

    stopFollow =  () => {
        this.setState({isFollowing: false});
    };

    startFollow = (event) => {
        this.setState({isFollowing: true});
    };

    removeMeuble = () => {
        let newList = this.state.mesMeubles;
        newList.splice(this.state.selectedMeuble,1);
        this.setState({mesMeubles: this.state.mesMeubles})
    }

    updateMesMeubles = (e, property) => {
        this.setState(prevState => {
            let newList = prevState.mesMeubles;
            newList[this.state.selectedMeuble][property] = e;
            return {mesMeubles: newList};
        })
    }

    handleArrow = (e) => {
        if(this.state.mesMeubles.length !== 0 && this.state.focus) {
            if (e.keyCode === 38) {
                this.updateMesMeubles(this.state.mesMeubles[this.state.selectedMeuble].posY - 1, 'posY')
            } else if (e.keyCode === 40) {
                this.updateMesMeubles(this.state.mesMeubles[this.state.selectedMeuble].posY + 1, 'posY')
            } else if (e.keyCode === 37) {
                this.updateMesMeubles(this.state.mesMeubles[this.state.selectedMeuble].posX - 1, 'posX')
            } else if (e.keyCode === 39) {
                this.updateMesMeubles(this.state.mesMeubles[this.state.selectedMeuble].posX + 1, 'posX')
            }
        }
    }

    myPlaceRef: ?HTMLElement;

    convertSizeWidth = (size) => {
            return this.myPlaceRef ? (size * 100) / this.state.myPlace.long : 0;
    }
    convertSizeHeight = (size) => {
            return this.myPlaceRef ? (size * 100) / this.state.myPlace.larg : 0;
    }

    render() {
        console.log(this.state.selectedMeuble)
        return (
            <div className="home">
                <div className="menu" onClick={() => this.setState({focus: false})}>
                    <div className="tabs">
                        <div
                            className={`tab ${this.state.action !== 'CREATE' ? 'tab--not-selected' : ''}`}
                            onClick={() => this.setState({action: 'CREATE'})}
                        >
                            Créer
                        </div>
                        <div
                            className={`tab ${this.state.action !== 'MODIFY' ? 'tab--not-selected-right' : ''}`}
                            onClick={() => this.setState({action: 'MODIFY'})}
                        >
                            Modifier
                        </div>
                    </div>
                    {
                        this.state.action === "CREATE" &&
                        <Fragment>
                            <div>
                                <div className="label">longueur</div>
                                <input
                                    value={this.state.newMeuble.long}
                                    type="number"
                                    onChange={e => this.setState({newMeuble: { ...this.state.newMeuble, long: e.target.value }})}
                                />
                                <div className="label">largeur</div>
                                <input
                                    value={this.state.newMeuble.larg}
                                    type="number"
                                    onChange={e => this.setState({newMeuble: { ...this.state.newMeuble, larg: e.target.value }})}
                                />
                                <button className="button" onClick={this.addMeuble}>Créer meuble</button>
                            </div>
                        </Fragment>
                    }
                    {
                        this.state.action === "MODIFY" &&
                        <Fragment>
                            <div className="label">longueur</div>
                            <input
                                value={this.state.mesMeubles[this.state.selectedMeuble] ? this.state.mesMeubles[this.state.selectedMeuble].long : ''}
                                type="number"
                                onChange={e => this.updateMesMeubles(e.target.value, "long")}
                            />
                            <div className="label">largeur</div>
                            <input
                                value={this.state.mesMeubles[this.state.selectedMeuble] ? this.state.mesMeubles[this.state.selectedMeuble].larg : ''}
                                type="number"
                                onChange={e => this.updateMesMeubles(e.target.value, "larg")}
                            />
                            <div className="label">color</div>
                            <input
                                value={this.state.mesMeubles[this.state.selectedMeuble] ? this.state.mesMeubles[this.state.selectedMeuble].color : ''}
                                type="text"
                                onChange={e => this.updateMesMeubles(e.target.value, "color")}
                            />
                            <div className="label">name</div>
                            <input
                                value={this.state.mesMeubles[this.state.selectedMeuble] ? this.state.mesMeubles[this.state.selectedMeuble].name : ''}
                                type="string"
                                onChange={e => this.updateMesMeubles(e.target.value, "name")}
                            />
                            <div className="label">posX</div>
                            <input
                                value={this.state.mesMeubles[this.state.selectedMeuble] ? this.state.mesMeubles[this.state.selectedMeuble].posX : ''}
                                type="number"
                                onChange={e => this.updateMesMeubles(e.target.value, "posX")}
                            />
                            <div className="label">posY</div>
                            <input
                                value={this.state.mesMeubles[this.state.selectedMeuble] ? this.state.mesMeubles[this.state.selectedMeuble].posY : ''}
                                type="number"
                                onChange={e => this.updateMesMeubles(e.target.value, "posY")}
                            />
                            <div className="label">angle</div>
                            <input
                                value={this.state.mesMeubles[this.state.selectedMeuble] ? this.state.mesMeubles[this.state.selectedMeuble].angle : ''}
                                type="number"
                                onChange={e => this.updateMesMeubles(e.target.value, "angle")}
                            />
                            <button
                                className="button"
                                onClick={this.removeMeuble}
                            >
                                Enlever meuble
                            </button>
                        </Fragment>
                    }
                </div>
                <div className="drawing-zone">
                    {
                        console.log(this.state.myPlace.long, this.state.myPlace.larg, this.state.myPlace.long >= this.state.myPlace.larg)
                    }
                    <div
                        className="my-place"
                        ref={e => this.myPlaceRef = e}
                        style={{
                            width: this.state.myPlace.long >= this.state.myPlace.larg ? '90%' : `${this.state.adaptedValue}px`,
                            height: this.state.myPlace.long >= this.state.myPlace.larg ? `${this.state.adaptedValue}px` : '90%',
                        }}
                    >
                        {
                            this.state.mesMeubles.map((meuble, index) => (
                                <div
                                    key={Math.random()*100}
                                    className="meuble"
                                    onMouseDown={
                                        (e) => this.setState({ selectedMeuble: index, newMeuble: {}, focus: true }, () => {
                                        this.startFollow(e);
                                    })}
                                    // onMouseDown={this.startFollow}
                                    onMouseUp={this.stopFollow}
                                    style={{
                                        width: `${this.convertSizeWidth(meuble.long)}%`,
                                        height: `${this.convertSizeHeight(meuble.larg)}%`,
                                        background: meuble.color || '',
                                        top: `${meuble.posY}px` || '',
                                        left: `${meuble.posX}px` || '',
                                        transform: `rotate(${meuble.angle}deg)` || '',
                                    }}
                                >
                                    {meuble.name}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}