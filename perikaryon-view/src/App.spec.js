import React from 'react';
import Toolbar from './components/Toolbar'
import {getAreas} from './App'
import RoomContextProvider, {RoomContext, getAreasStatic} from './contexts/RoomContext'
import "whatwg-fetch";
import {renderHook} from "@testing-library/react-hooks"
import { render } from '@testing-library/react';
import fetchMock from "fetch-mock"
import {act} from "react-test-renderer"
import {List, Record, fromJS, isKeyed, Map} from 'immutable'

    // beforeAll(() => {
    //    
    // })
    // afterAll(() => {
    //     
    // })

it('should return structured data with successful request', async () => {
    global.fetch = fetch;
    
    fetchMock.mock('http://localhost:3004/areasFiles',[
        {"manifest":{"title":"Map Test","info":{"respawnInterval":60},"instanced":"player","bundlePath":"/home/wotterbox/ranviermud/bundles/bundle-example-areas/areas/mapped"},"npcs":[{"id":"squirrel","keywords":["squirrel"],"name":"A Squirrel","level":2,"description":"A furry little squirrel","behaviors":{"ranvier-wander":{"interval":30,"areaRestricted":true}}}],"rooms":[{"id":"start","title":"Begin","coordinates":[0,0,0],"description":"You are in the start of this area. There are hallways to the north and south.","npcs":["mapped:squirrel"]},{"id":"hallway-north-1","title":"Hallway North 1","coordinates":[0,1,0],"description":"You are in the north hallway."},{"id":"hallway-north-2","title":"Hallway North 2","coordinates":[0,2,0],"description":"You are in the north hallway."},{"id":"basement-north","title":"Basement","coordinates":[0,2,-1],"description":"You are in the basement.","doors":{"mapped:hallway-north-2":{"closed":true}}},{"id":"hallway-south-1","title":"Hallway South 1","coordinates":[0,-1,0],"description":"You are in the south hallway."},{"id":"hallway-south-2","title":"Hallway South 2","coordinates":[0,-2,0],"description":"You are in the south hallway."},{"id":"attic-south","title":"Attic","coordinates":[0,-2,1],"description":"You are in the attic.","exits":[{"direction":"east","roomId":"limbo:white"}]},{"id":"hallway-east-1","title":"Hallway East 1","coordinates":[1,0,0],"description":"You are in the east hallway."},{"id":"hallway-east-2","title":"Hallway East 2","coordinates":[2,0,0],"description":"You are in the east hallway."},{"id":"hallway-east-3","title":"Hallway East 3","coordinates":[2,-1,0],"description":"You are in the east hallway."}]}
    ]);
    const response = await getAreas()
    expect(response.get(0).get("manifest").size).toBe(4)
    expect(response.get(0).get("npcs").size).toBe(1)
    expect(response.get(0).get("rooms").size).toBe(10)
    fetchMock.restore()
})
it('should generate a dropdown with options corresponding to the maps currently available and a default option', () => {
    const response = getAreasStatic(JSON.parse('[{"manifest":{"title":"Map Test","info":{"respawnInterval":60},"instanced":"player","bundlePath":"/home/wotterbox/ranviermud/bundles/bundle-example-areas/areas/mapped"},"npcs":[{"id":"squirrel","keywords":["squirrel"],"name":"A Squirrel","level":2,"description":"A furry little squirrel","behaviors":{"ranvier-wander":{"interval":30,"areaRestricted":true}}}],"rooms":[{"id":"start","title":"Begin","coordinates":[0,0,0],"description":"You are in the start of this area. There are hallways to the north and south.","npcs":["mapped:squirrel"]},{"id":"hallway-north-1","title":"Hallway North 1","coordinates":[0,1,0],"description":"You are in the north hallway."},{"id":"hallway-north-2","title":"Hallway North 2","coordinates":[0,2,0],"description":"You are in the north hallway."},{"id":"basement-north","title":"Basement","coordinates":[0,2,-1],"description":"You are in the basement.","doors":{"mapped:hallway-north-2":{"closed":true}}},{"id":"hallway-south-1","title":"Hallway South 1","coordinates":[0,-1,0],"description":"You are in the south hallway."},{"id":"hallway-south-2","title":"Hallway South 2","coordinates":[0,-2,0],"description":"You are in the south hallway."},{"id":"attic-south","title":"Attic","coordinates":[0,-2,1],"description":"You are in the attic.","exits":[{"direction":"east","roomId":"limbo:white"}]},{"id":"hallway-east-1","title":"Hallway East 1","coordinates":[1,0,0],"description":"You are in the east hallway."},{"id":"hallway-east-2","title":"Hallway East 2","coordinates":[2,0,0],"description":"You are in the east hallway."},{"id":"hallway-east-3","title":"Hallway East 3","coordinates":[2,-1,0],"description":"You are in the east hallway."}]}]'))
    const wrapper = ({ children }) => <RoomContextProvider data={response}>{children}</RoomContextProvider>
    const { result } = renderHook(() => Toolbar(), { wrapper });
    const { container } = render(result.current)
    
    expect(container.getElementsByTagName('option')[0].value).toBe('')
    expect(container.getElementsByTagName('option')[1].value).toBe('Map Test')
})