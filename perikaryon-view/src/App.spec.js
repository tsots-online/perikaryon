import React from 'react';
import Renderer from 'react-test-renderer';
import {shallow, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'
import App from "./App"
const {List, Set} = require('immutable');

var json = require('./TestData.json')

configure({adapter: new Adapter()})

describe('Test snapshot of component', () => {
    it('Snapshot has not changed', () => {
        const component = Renderer.create(<App />);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
describe('When a room is added to the grid, it', () => {
    it('should be created', () => {
        const component = shallow(<App />);
        const instance = component.instance();

        instance.setState({ranvierAPIResponse:json})
        instance.setState({selectedArea:'mapped'})
        instance.setState({selectedFloor:0})
        instance.InitializeRoomMap()
        instance.state.addRoomField = 'Blep'
        instance.AddRoom(instance.state.addRoomField)
        
        expect(component.exists('#Blep')).toBe(true)
        expect(instance.state.roomData.has('mappedBlep')).toBe(true);
    });
    it('should have coordinates 0,0,0', () => {
        const component = shallow(<App />);
        const instance = component.instance();
        const DEFAULT_NEW_ROOM_COORDINATES = {x:0, y:0, z:0}

        instance.setState({ranvierAPIResponse:json})
        instance.setState({selectedArea:'mapped'})
        instance.setState({selectedFloor:0})
        instance.InitializeRoomMap()
        instance.state.addRoomField = 'Blep'
        instance.AddRoom(instance.state.addRoomField)

        const coord = component.find('div#Blep');

        expect(coord.props()).toHaveProperty('coordinate_values', DEFAULT_NEW_ROOM_COORDINATES)
        expect(instance.state.roomData.get('mappedBlep').coordinates).toStrictEqual(DEFAULT_NEW_ROOM_COORDINATES);
    });
    it('should have the name given to it in the associated field', () => {
        const component = shallow(<App />);
        const instance = component.instance();
        const NEW_ROOM_NAME = 'Blep'

        instance.setState({ranvierAPIResponse:json})
        instance.setState({selectedArea:'mapped'})
        instance.setState({selectedFloor:0})
        instance.InitializeRoomMap()
        instance.state.addRoomField = NEW_ROOM_NAME
        instance.AddRoom(instance.state.addRoomField)
        
        const addedRoom = component.find('div#Blep');

        expect(addedRoom.text()).toBe('Blep(0,0,0)')
        expect(instance.state.roomData.get('mappedBlep').title).toBe(NEW_ROOM_NAME);
    });
    it('should not be created if name is blank', () => {
        const component = shallow(<App />);
        const instance = component.instance();
        const NEW_ROOM_NAME = ''

        instance.setState({ranvierAPIResponse:json})
        instance.setState({selectedArea:'mapped'})
        instance.setState({selectedFloor:0})
        instance.InitializeRoomMap()
        instance.state.addRoomField = NEW_ROOM_NAME
        instance.AddRoom(instance.state.addRoomField)
        
        const roomThatWasNotAdded = component.contains('div#Blep');

        expect(roomThatWasNotAdded).toBe(false)
        expect(instance.state.roomData.has('mapped')).toBe(false);
    });
});
describe('After loading the test data, the component', () => {
    it('should contain 3 floors', () => {
        const component = shallow(<App />);
        const instance = component.instance();
        const NUMBER_OF_FLOORS_IN_TEST_DATA = 3;

        instance.setState({ranvierAPIResponse:json})
        instance.setState({selectedArea:'mapped'})
        instance.GenerateFloorDropdown()
        
        const floorDropDown = component.find('select#floorDropDown');

        expect(floorDropDown.children()).toHaveLength(NUMBER_OF_FLOORS_IN_TEST_DATA)
        expect(instance.state.floorList.count())
            .toBe(NUMBER_OF_FLOORS_IN_TEST_DATA)
    });

    it('should contain floors -1, 0, and 1', () => {
        const component = shallow(<App />);
        const instance = component.instance();
        instance.setState({ranvierAPIResponse:json})
        instance.setState({selectedArea:'mapped'})
        instance.GenerateFloorDropdown()

        const floorDropDown = component.find('select#floorDropDown');

        expect(floorDropDown.childAt(0).props()).toHaveProperty('value', 0)
        expect(floorDropDown.childAt(1).props()).toHaveProperty('value', -1)
        expect(floorDropDown.childAt(2).props()).toHaveProperty('value', 1)
        expect(instance.state.floorList
            .every(option => [0, -1, 1].includes(option.props.value)))
            .toBe(true);
    });
    
    it('should contain 3 areas', () => {
        const component = shallow(<App />);
        const instance = component.instance();
        const NUMBER_OF_AREAS_IN_TEST_DATA = 3;
        const NUMBER_OF_BLANKS_IN_OPTIONS = 1;

        instance.setState({ranvierAPIResponse:json})
        instance.GenerateAreaDropdown()
        
        const areaDropDown = component.find('select#areaDropdown');

        expect(areaDropDown.children()).toHaveLength(NUMBER_OF_AREAS_IN_TEST_DATA + NUMBER_OF_BLANKS_IN_OPTIONS)
        expect(instance.state.areaList.count())
            .toBe(NUMBER_OF_AREAS_IN_TEST_DATA);
    });
    it('should contain the mapped, craft, and limbo areas', () => {
        const component = shallow(<App />);
        const instance = component.instance();

        instance.setState({ranvierAPIResponse:json})
        instance.GenerateAreaDropdown()

        const areaDropDown = component.find('select#areaDropdown');

        expect(areaDropDown.childAt(0).props()).toHaveProperty('value', '')
        expect(areaDropDown.childAt(1).props()).toHaveProperty('value', 'limbo')
        expect(areaDropDown.childAt(2).props()).toHaveProperty('value', 'mapped')
        expect(areaDropDown.childAt(3).props()).toHaveProperty('value', 'craft')
        expect(instance.state.areaList
            .every(option => ['mapped','craft','limbo'].includes(option.props.value)))
            .toBe(true);
    });

    it('should contain 8 rooms', () => {
        const component = shallow(<App />);
        const instance = component.instance();
        const NUMBER_OF_ROOMS_IN_TEST_DATA = 8;

        instance.setState({ranvierAPIResponse:json})
        instance.setState({selectedArea:'mapped'})
        instance.setState({selectedFloor:0})
        instance.InitializeRoomMap()

        const areaGraph = component.find('div#reactgrid');

        expect(areaGraph.childAt(0).children()).toHaveLength(NUMBER_OF_ROOMS_IN_TEST_DATA)
        expect(instance.GenerateAreaGraph().count())
            .toBe(NUMBER_OF_ROOMS_IN_TEST_DATA);
    });
    it('should have these specific room keys', () => {
        const component = shallow(<App />);
        const instance = component.instance();
        const INTERNAL_ROOM_KEYS_IN_DATA_SET = ['0', '1', '2', '4', '5', '7', '8', '9'];

        instance.setState({ranvierAPIResponse:json})
        instance.setState({selectedArea:'mapped'})
        instance.setState({selectedFloor:0})

        expect(instance.GenerateAreaGraph()
            .every(room => INTERNAL_ROOM_KEYS_IN_DATA_SET.includes(room.key)))
            .toBe(true);
    });
});