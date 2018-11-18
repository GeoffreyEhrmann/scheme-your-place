// @flow

import React, { Fragment } from 'react';
import type { Meuble } from '../types/Meubles';
import DrawYourPlace from "./DrawYourPlace";

type State = {
    myPlace: Meuble,
    myPlaceIsCreated: boolean,
}
export default class Home extends React.Component<Props> {
    state = {
        myPlace: {long: 0, larg: 0},
        myPlaceIsCreated: false,
    }


    render() {
        if (!this.state.myPlaceIsCreated) {
            return (
                <div>
                    <div className="label">longueur</div>
                    <input
                        value={this.state.myPlace.long}
                        type="number"
                        onChange={e => this.setState({myPlace: { ...this.state.myPlace, long: e.target.value }})}
                    />
                    <div className="label">largeur</div>
                    <input
                        value={this.state.myPlace.larg}
                        type="number"
                        onChange={e => this.setState({myPlace: { ...this.state.myPlace, larg: e.target.value }})}
                    />
                    <button className="button" onClick={() => this.setState({myPlaceIsCreated : true})}>Créer mon appartement</button>
                </div>
            )
        }

        return (
            <DrawYourPlace myPlace={this.state.myPlace} />
        )
    }
}