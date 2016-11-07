import React, { Component } from 'react';
import {
  Text,
  Animated,
  Image,
  StyleSheet,
  View
} from 'react-native';
import RNShakeEvent from 'react-native-shake-event';

export default class testShake extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Seungyeon: 'false',
      bounceValue: new Animated.Value(0.7)
    }
  }

  _shakeFunctionTwo() {
        requestAnimationFrame(() => {
    			this._animateIn();
        });
  }

  _animateIn = () => {
    Animated.spring(                          // Base: spring, decay, timing
      this.state.bounceValue,                 // Animate `bounceValue`
      {
        toValue: 0.4,                         // Animate to smaller size
        friction: 1,

      }
    ).start(this._animateOut);                // Start the animation
  }

  _animateOut = () => {
    Animated.spring(                          // Base: spring, decay, timing
      this.state.bounceValue,                 // Animate `bounceValue`
      {
        toValue: 0.7,                         // Animate back
        friction: 1,

      }
    ).start(this._animateIn);                 // Start the animation
  }

  componentDidMount() {
    RNShakeEvent.addEventListener('shake', () => {
      this._shakeFunction();
      this._shakeFunctionTwo();
    });
  }

  componentWillUnmount() {
    RNShakeEvent.removeEventListener('shake');
  }

  _shakeFunction() {
    let status = this.state.Seungyeon;
    if(status == 'false') {
      this.setState({Seungyeon: 'true'});
    } else {
      this.setState({Seungyeon: 'false'});
    }
  }

  render() {
    return (
      <View>
      <Text style={{fontSize: 50}}>{this.state.Seungyeon}</Text>
      <Animated.Image
        source={require('./shakeshake.png')}
        style={{
          flex: 1,
          transform: [
            {scale: this.state.bounceValue},
          ]
        }}
      />
      </View>
    );
  }
}
