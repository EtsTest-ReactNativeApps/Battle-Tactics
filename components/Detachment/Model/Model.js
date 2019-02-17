import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GhostModel from './GhostModel';
import Test from './Test';
import { 
    View,
    Animated,
    PanResponder,
    Dimensions,
} from 'react-native';
import { Platform } from 'expo-core';

let Window = Dimensions.get('window');
const SCREEN_WIDTH = Window.width;
const MODEL_RADIUS = SCREEN_WIDTH / 48;
const ON_TOUCH_MULTIPLIER = 6;
const ON_TOUCH_MODEL_OFFSET = (MODEL_RADIUS*ON_TOUCH_MULTIPLIER - MODEL_RADIUS)/2;
const ON_TOUCH_MODEL_HIGHLIGHT = MODEL_RADIUS*ON_TOUCH_MULTIPLIER;
this.ON_TOUCH_MODEL_HIGHLIGHT = ON_TOUCH_MODEL_HIGHLIGHT;
export default class Model extends Component {
    constructor(props) {
        super(props);

        this.state = {
            onTouch: false,
            ghostModel: false,
            resetPosition: false,
            offsetX: 0,
            offsetY: 0,
            doubleTap: false,
            modalActive: false
        }

        let timer;
        this.timer = timer;
        const unit = this.props.unit;
        const position = new Animated.ValueXY({x: unit.x, y: unit.y });

        this.val = { x: unit.x, y: unit.y }
        position.addListener((value) => this.val = value);
        
        this.unit = unit;
        this.movement = unit.m;
        this.position = position;
    }

    componentWillMount() {
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
            onPanResponderGrant: this._handlePanResponderGrant,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderEnd,
            onShouldBlockNativeResponder: (event, gesture) => false,
            onPanResponderTerminationRequest: (event, gesture) => false,
        });
    }

    _handleStartShouldSetPanResponder = (event, gesture) => {
        
        // console.log("You are now touching the model component.");
        this.setState({
            ghostModel: true
        }, () => {
            // console.log(this.state)
        })
        this.delayHighlight();
        return true;
    }

    _handlePanResponderGrant = (event, gesture) => {
        // if (this.state.longPress === true) {
            this.props.getStartXY(event.nativeEvent.touches[0].pageX, event.nativeEvent.touches[0].pageY);
            this.position.setOffset({
                x: this.val.x,
                y: this.val.y 
            });
        // }
    }

    _handlePanResponderMove = (event, gesture) => {
        // console.log(gesture.dx + ", " + gesture.dy)
        // Single Touch moves the Model.js component.
        if (gesture.numberActiveTouches === 1) {
            this.position.setValue({
                x: gesture.dx / this.props.state.scale, 
                y: gesture.dy / this.props.state.scale 
            })

            // Only calc distance if 1 finger is touching the screen.
            this.props.calcDistance(gesture);
        } // END_IF

        // Two Finger touch places component in 'reset' state.
        if (gesture.numberActiveTouches === 2 && 
            this.state.resetPosition === false) {
            // console.log("The RESET PROCESS has been initiated!");

            // Set 'resetPosition' to true. to prevent this code from firing more than once.
            this.setState({
                resetPosition: true,
            }, () => {
                // console.log(this.state)
            })

            // Change the OFFSET of the 'position' object to visually show that this component will be reset back to it's prior position.
            this.position.setOffset({
                x: this.unit.x - gesture.dx / this.props.state.scale,
                y: this.unit.y - gesture.dy / this.props.state.scale
                })

            // Set LOCAL-STATE for the values of X and Y from the above position.setOffset()
            this.setState({
                offsetX: this.unit.x - gesture.dx / this.props.state.scale,
                offsetY: this.unit.y - gesture.dy / this.props.state.scale,
            }, () => {
                // console.log(
                    // "offsetX: " + this.state.offsetX + "\n" + 
                    // "offsetY: " + this.state.offsetY
                // )
                // CB-function to call helper function that will assign the offset X Y values to our models.json in the correct location.
                this.resetModelLocation(
                    this.state.offsetX, this.state.offsetY
                    );
                // Console.log that the 'Reset Procedure has been completed'
                // console.log("The RESET PROCESS has been completed.")
            })
        } // END_IF    
    }

    _handlePanResponderEnd =  (event, gesture) => {
        this.tapForModal(event);
        this.cancelTimer();
        this.props.getEndXY(event.nativeEvent.pageX, event.nativeEvent.pageY);
        // console.log("You are no longer touching the model component.")
        this.setState({
            onTouch: false,
            ghostModel: false,
            resetPosition: false,
        }, () => {
            // console.log(this.state)
        })
        this.updateModelLocation(gesture);
        this.props.calcDistance(gesture);
        this.props.clearEndXY();
    }

    // HELPER FUNCTIONS ////

    // Function to reset Model XY Data in model json.
    resetModelLocation (offsetX, offsetY) {
        // console.log("The resetModelLocation function has been called.")
        // Check that the values have been passed in correctly.
        // console.log(
        //     "offsetX: " + offsetX + "\n" +
        //     "offsetY: " + offsetY
        //     )
        // Functional Code to dynamically replace the X and Y values for this specific component within Models.json
        // Use the SPREAD OPERATOR to assign the data inside of Models.json into a CONST variable called 'oldUnits'.
        const oldUnits = [...this.props.playerState.units];
        // Console.log oldUnits to check for correct data.
        // console.log(oldUnits);
        // Use the .map method to iterate through the oldUnits array and assign the results into a CONST variable called 'updatedUnits'.
        const updatedUnits = oldUnits.map(unit => {
            // IF, the unit.id matches the .id of this component...
            if (unit.id === this.props.id) {
                // THEN, assign the offsetX and Y values to the proper location.
                // Use the SPREAD OPERATOR to allow us to assign offsetX and Y.
                const newUnit = {...unit};
                newUnit.x = offsetX;
                newUnit.y = offsetY;
                return newUnit;
            } else {
                // ELSE, don't make any changes and just return the same object.
                return unit;    
            }
        });
        // call the .updateUnits(updatedUnits); function from AppContext.js.
        this.props.updateUnits(updatedUnits);
        // Console.log the end of this function..
        // console.log("The resetModelLocation function has ended.")    
    }

    // Function to update Model XY Data in model json.
    updateModelLocation (gesture) {
        const oldUnits = [...this.props.playerState.units];
        const updatedUnits = oldUnits.map(unit => {
            if (unit.id === this.props.id &&
                this.state.resetPosition === true) {
                const newUnit = {...unit};
                newUnit.x = unit.x - gesture.dx / this.props.state.scale;
                newUnit.y = unit.y - gesture.dy / this.props.state.scale;
                return newUnit;
            } else if (unit.id === this.props.id) {
                const newUnit = {...unit};
                newUnit.x = unit.x + gesture.dx / this.props.state.scale;
                newUnit.y = unit.y + gesture.dy / this.props.state.scale;
                return newUnit;
            } else {
                return unit;
            }
        });
        this.props.updateUnits(updatedUnits);
    }
    
    // Function to determine if a user has tried to open the Modal.
    tapForModal = (event) => {
        // Calculate distance traveled in x and y.
        let x = Math.abs(this.props.state.startXY.x - event.nativeEvent.pageX);
        let y = Math.abs(this.props.state.startXY.y - event.nativeEvent.pageY);
        // console.log(`x: ${x} y: ${y}`)
        // IF user has moved less than 3px in any direction, deploy the Modal.
        if (x <= 3 || y <= 3 && this.state.resetPosition === false) {
            // console.log("Deploying Modal...")
            this.props.deployModal(this.props.unit);
        }
    }

    //  // Function to determine if a user has double-tapped on the screen.
    // lastTap = null;
    // handleDoubleTap = () => {
    //     const now = Date.now();
    //     const DOUBLE_PRESS_DELAY = 300;
    //     if (this.lastTap && now - this.lastTap < DOUBLE_PRESS_DELAY) {
    //         // console.log("DoubleTap!");
    //         this.props.deployModal(this.props.unit);
    //     } else {
    //         this.lastTap = now;
    //         // console.log("no Doubletap.");
    //     }
    // };

    // Function to delay the display of model highlight dependant of conditions.
    delayHighlight = () => {
        // console.log("Timeout process started.") 
        this.timer = setTimeout(() => {
            this.setState({
                onTouch: true,
            }, () => {
                // console.log(this.state)
            })
            this.timer = "end";
            // console.log("Timeout process complete.")
        }, 290);           
    }

    cancelTimer = () => {
        if (this.timer !== "end") {
            clearTimeout(this.timer);
            // console.log("Timeout process cancelled.")
        }
    }

    // // Toggle function that works in conjunction with 'handleDoubleTap' to change the styling of our pop-up modal and make it invisible/visible.
    // toggleDblTap = () => {
    //     this.setState(previousState => (
    //         { 
    //             doubleTap: !previousState.doubleTap,
    //             // modalPopUp: !previousState.modalPopUp
    //         }
    //     ), () => {
    //         console.log(
    //             "doubleTap: " + this.state.doubleTap + "\n" +
    //             "modalPopUp: " + this.state.modalPopUp
    //             )
    //             if (this.state.doubleTap === true) {    
    //                 // IF doubleTap state is true, display pop-up modal.
    //                 console.log("Modal should be visible.");
    //             } else {
    //                 // IF doubleTap state is false, hide pop-up modal.
    //                 console.log("Modal should NOT be visible.");
    //             }
    //             console.log(this.unit);
    //             // this.props.deployModal(this.unit);
    //         });
            
    // }

    // STYLE FUNCTIONS ////
    
    onTouchModelStyle () {
        if (this.state.onTouch === true) {
            return styles.onTouch;            
        } else {
            return styles.model;
        }
    }
    
    maxMovementStyle () {
        if (this.props.state.inches <= this.movement && this.state.onTouch) {
            // Border Color should be Red!
            return styles.overMaxDistance;
        } else if (this.props.state.inches >= this.movement && this.state.onTouch) {
            // Border Color should be Green!
            return styles.underMaxDistance;
        } else {
            return styles.offTouch;
        }
    }

    whichPlayerStyle () {
        if (this.props.modelP1 === undefined) {
            return this.props.modelP2
        } else {
            return this.props.modelP1
        }
    }

    whichPlayerBorder () {
        if (this.props.modelP1 === undefined) {
            return styles.borderP2
        } else {
            return styles.borderP1
        }
    }

    // RENDER FUNCTIONS ////

    // modalPopUp () {
    //     if (this.state.modalPopUp === true) {
    //         return (
    //             <Test val={this.val} />
    //         )
    //     } else if (this.state.modalPopUp === false) {

    //     }
    // }
    
    placeGhostModel () {
        if (this.state.ghostModel === true) {
            return (
                <GhostModel val={this.val} modelStyle={styles[styles.model]} />
            )
        } else if (this.state.onTouch === false) {

        }
    }

    renderModels() {
        return (
            <Animated.View
                    style={[this.position.getLayout()]}
                    {...this.panResponder.panHandlers}
                    
                >
                    <View 
                        onTouchStart={this.handleDoubleTap}
                        style={[this.whichPlayerBorder(), this.onTouchModelStyle(), this.maxMovementStyle(), this.whichPlayerStyle()]}
                    />
            </Animated.View>
        )
    }

    // onTouchStart={() => console.log('A unspecified touched')}
    // onPress={this.handleDoubleTap}

    render() {
        return (
            <View style={styles.mainContainer}>
                    {this.renderModels()}
                {this.placeGhostModel()}
                {/* {this.modalPopUp()} */}
            </View>
        )
    }
}


const styles = {
    text: {
        paddingTop: 4,
        fontWeight: '800',
        textAlign: 'center',
        color: '#fff'
        },
    mainContainer: {
        flex: 1,
        height: Window.height,
        width: Window.width,
        top: 0,
        left: 0
        // top: 40,
        // left: Window.width / 2 - MODEL_RADIUS / 2
    },
    model: {
        width: MODEL_RADIUS,
        height: MODEL_RADIUS,
        borderWidth: .025,
        borderRadius: MODEL_RADIUS,
        marginTop: ON_TOUCH_MODEL_OFFSET,
        marginLeft: ON_TOUCH_MODEL_OFFSET,
        padding: 0
    },
    borderP1: {
        borderColor: '#000',
    },
    borderP2: {
        borderColor: '#fff',
    },
    onTouch: {
        width: this.ON_TOUCH_MODEL_HIGHLIGHT,
        height: this.ON_TOUCH_MODEL_HIGHLIGHT,
        margin: 0,
        padding: 0,
        opacity: 0.6,
    },
    offTouch: {
        borderWidth: .5,
        borderRadius: MODEL_RADIUS,
        opacity: 1.0
    },
    underMaxDistance: {
        backgroundColor: '#fff',
        borderColor: '#f00',
        borderWidth: 6,
        borderRadius: this.ON_TOUCH_MODEL_HIGHLIGHT,
    },
    overMaxDistance: {
        backgroundColor: '#fff',
        borderColor: '#0f0',
        borderWidth: 2,
        borderRadius: this.ON_TOUCH_MODEL_HIGHLIGHT,
    }
};