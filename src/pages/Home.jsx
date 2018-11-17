// @flow

import React, { Fragment } from 'react';
import type { Meuble } from '../types/Meubles';

type State = {
    mesMeubles: Meuble[],
    selectedMeuble: Number,
    myPlace: Meuble,
    newMeuble: Meuble,
    action: string,
    isFollowing: boolean,
}
export default class Home extends React.Component<Props> {
    state = {
        action: 'CREATE',
        mesMeubles: [],
        selectedMeuble: 0,
        myPlace: {
            long: 440,
            larg: 505,
        },
        newMeuble: {posX: 0, posY: 0, angle: 0, color: '', name: ''},
        isFollowing: false,
    }
    componentDidMount() {
        console.log(this.state.myPlace.long * this.myPlaceRef.offsetHeight / this.state.myPlace.larg)
        console.log(this.state.myPlace.long , this.myPlaceRef.offsetHeight , this.state.myPlace.larg)
        if (this.state.myPlace.long >= this.state.myPlace.larg) {
            console.log('long > larg')
            this.setState({myPlace: { ...this.state.myPlace, larg: this.state.myPlace.larg * this.myPlaceRef.offsetWidth / this.state.myPlace.long } })
        } else {
            console.log('larg > long')
            this.setState({myPlace: { ...this.state.myPlace, long: this.state.myPlace.long * this.myPlaceRef.offsetHeight / this.state.myPlace.larg } })
        }

        window.addEventListener('keydown',this.handleArrow)
    }

    addMeuble = () => {
        this.setState({
            mesMeubles: [...this.state.mesMeubles, this.state.newMeuble],
            newMeuble: {
                posX: 0,
                posY: 0,
                larg: 0,
                long: 0,
            }
        });
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
        this.updateMesMeubles(event.clientX - this.myPlaceRef.offsetLeft - this.state.mesMeubles[this.state.selectedMeuble].long/2, 'posX')
        this.updateMesMeubles(event.clientY - this.myPlaceRef.offsetTop - this.state.mesMeubles[this.state.selectedMeuble].larg/2, 'posY')
        console.log(event.clientX - this.myPlaceRef.offsetLeft, event.clientY - this.myPlaceRef.offsetTop)
    };

    stopFollow =  () => {
        this.setState({isFollowing: false});
    };

    startFollow = (event) => {
        console.log(event.clientX, event.clientY)
        this.setState({isFollowing: true});
    };

    removeMeuble = () => {
        let newList = this.state.mesMeubles;
        newList.splice(this.state.selectedMeuble,1);
        this.setState({mesMeubles: this.state.mesMeubles})
    }

    updateMesMeubles = (e, property) => {
        console.log(e)
        this.setState(prevState => {
            let newList = prevState.mesMeubles;
            newList[this.state.selectedMeuble][property] = e;
            console.log(newList[this.state.selectedMeuble])
            return {mesMeubles: newList};
        })
    }

    handleArrow = (e) => {
        if(this.state.mesMeubles.length !== 0) {
            console.log("okok")
            // arrow up/down button should select next/previous list element
            if (e.keyCode === 38) {
                console.log('up')
                this.updateMesMeubles(this.state.mesMeubles[this.state.selectedMeuble].posY - 1, 'posY')
            } else if (e.keyCode === 40) {
                console.log('down')
                this.updateMesMeubles(this.state.mesMeubles[this.state.selectedMeuble].posY + 1, 'posY')
            } else if (e.keyCode === 37) {
                console.log('left')
                this.updateMesMeubles(this.state.mesMeubles[this.state.selectedMeuble].posX - 1, 'posX')
            } else if (e.keyCode === 39) {
                console.log('right')
                this.updateMesMeubles(this.state.mesMeubles[this.state.selectedMeuble].posX + 1, 'posX')
            }
        }
    }

    myPlaceRef: ?HTMLElement;

    convertSize = (size) => {
        console.log(this.myPlaceRef.offsetWidth, size, size * 100 / this.myPlaceRef.offsetWidth)
        return this.myPlaceRef ? (size * 100) / this.myPlaceRef.offsetWidth : 0;
    }

    render() {
        return (
            <div className="home">
                <div className="menu">
                    <div className="tabs">
                        <div
                            className={`tab ${this.state.action === 'CREATE' ? 'tab--selected' : ''}`}
                            onClick={() => this.setState({action: 'CREATE'})}
                        >
                            Créer
                        </div>
                        <div
                            className={`tab ${this.state.action === 'MODIFY' ? 'tab--selected' : ''}`}
                            onClick={() => this.setState({action: 'MODIFY'})}
                        >
                            Modifier
                        </div>
                    </div>
                    {
                        this.state.action === "CREATE" &&
                            <Fragment>
                                <div>
                                    <div>longueur</div>
                                    <input
                                        value={this.state.newMeuble.long}
                                        type="number"
                                        onChange={e => this.setState({newMeuble: { ...this.state.newMeuble, long: e.target.value }})}
                                    />
                                    <div>largeur</div>
                                    <input
                                        value={this.state.newMeuble.larg}
                                        type="number"
                                        onChange={e => this.setState({newMeuble: { ...this.state.newMeuble, larg: e.target.value }})}
                                    />
                                    <button onClick={this.addMeuble}>Créer meuble</button>
                                </div>
                            </Fragment>
                    }
                    {
                        this.state.action === "MODIFY" &&
                            <Fragment>
                                <div>longueur</div>
                                <input
                                    value={this.state.mesMeubles[this.state.selectedMeuble] ? this.state.mesMeubles[this.state.selectedMeuble].long : ''}
                                    type="number"
                                    onChange={e => { console.log(e.target.value) ; this.updateMesMeubles(e.target.value, "long")}}
                                />
                                <div>largeur</div>
                                <input
                                    value={this.state.mesMeubles[this.state.selectedMeuble] ? this.state.mesMeubles[this.state.selectedMeuble].larg : ''}
                                    type="number"
                                    onChange={e => this.updateMesMeubles(e.target.value, "larg")}
                                />
                                <div>color</div>
                                <input
                                    value={this.state.mesMeubles[this.state.selectedMeuble] ? this.state.mesMeubles[this.state.selectedMeuble].color : ''}
                                    type="text"
                                    onChange={e => this.updateMesMeubles(e.target.value, "color")}
                                />
                                <div>posX</div>
                                <input
                                    value={this.state.mesMeubles[this.state.selectedMeuble] ? this.state.mesMeubles[this.state.selectedMeuble].posX : ''}
                                    type="number"
                                    onChange={e => this.updateMesMeubles(e.target.value, "posX")}
                                />
                                <div>name</div>
                                <input
                                    value={this.state.mesMeubles[this.state.selectedMeuble] ? this.state.mesMeubles[this.state.selectedMeuble].name : ''}
                                    type="string"
                                    onChange={e => this.updateMesMeubles(e.target.value, "name")}
                                />
                                <div>posY</div>
                                <input
                                    value={this.state.mesMeubles[this.state.selectedMeuble] ? this.state.mesMeubles[this.state.selectedMeuble].posY : ''}
                                    type="number"
                                    onChange={e => this.updateMesMeubles(e.target.value, "posY")}
                                />
                                <div>angle</div>
                                <input
                                    value={this.state.mesMeubles[this.state.selectedMeuble] ? this.state.mesMeubles[this.state.selectedMeuble].angle : ''}
                                    type="number"
                                    onChange={e => this.updateMesMeubles(e.target.value, "angle")}
                                />
                                <button
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
                            width: this.state.myPlace.long >= this.state.myPlace.larg ? '90%' : `${this.state.myPlace.long}px`,
                            height: this.state.myPlace.long >= this.state.myPlace.larg ? `${this.state.myPlace.larg}px` : '90%',
                        }}
                    >
                        {
                            this.state.mesMeubles.map((meuble, index) => (
                                <div
                                    key={Math.random()*100}
                                    className="meuble"
                                    onClick={() => this.setState({selectedMeuble: index})}
                                    onMouseDown={this.startFollow}
                                    onMouseUp={this.stopFollow}
                                    style={{
                                        width: `${this.convertSize(meuble.long)}%`,
                                        height: `${this.convertSize(meuble.larg)}%`,
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