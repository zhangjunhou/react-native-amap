import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import MapView from 'react-native-amap-view'
var PriceMarker = require('./PriceMarker');

var { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
var id = 0;

var Event = React.createClass({
  shouldComponentUpdate(nextProps) {
    return this.props.event.id !== nextProps.event.id;
  },
  render() {
    var { event } = this.props;
    return (
      <View style={styles.event}>
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.eventData}>{JSON.stringify(event.data, null, 2)}</Text>
      </View>
    );
  },
});

var DisplayLatLng = React.createClass({
  getInitialState() {
    return {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      events: [],
    };
  },

  makeEvent(e, name) {
    return {
      id: id++,
      name: name,
      data: e.nativeEvent ? e.nativeEvent : e,
    };
  },

  recordEvent(name) {
    return e => {
      var { events } = this.state;
      this.setState({
        events: [
          this.makeEvent(e, name),
          ...events.slice(0, 10),
        ],
      });
    };
  },

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref="map"
          style={styles.map}
          initialRegion={this.state.region}
          onRegionChange={this.recordEvent('Map::onRegionChange')}
          onRegionChangeComplete={this.recordEvent('Map::onRegionChangeComplete')}
          onPress={this.recordEvent('Map::onPress')}
          onLongPress={this.recordEvent('Map::onLongPress')}
          onMarkerPress={this.recordEvent('Map::onMarkerPress')}
          onMarkerSelect={this.recordEvent('Map::onMarkerSelect')}
          onMarkerDeselect={this.recordEvent('Map::onMarkerDeselect')}
          onCalloutPress={this.recordEvent('Map::onCalloutPress')}
        >
          <MapView.Marker
            coordinate={this.state.region}
            onPress={this.recordEvent('Marker::onPress')}
            onSelect={this.recordEvent('Marker::onSelect')}
            onDeselect={this.recordEvent('Marker::onDeselect')}
            onCalloutPress={this.recordEvent('Marker::onCalloutPress')}
          >
            <PriceMarker amount={99} />
            <MapView.Callout
              style={styles.callout}
              onPress={this.recordEvent('Callout::onPress')}
            >
              <View>
                <Text>Well hello there...</Text>
              </View>
            </MapView.Callout>
          </MapView.Marker>
        </MapView>
        <View style={styles.eventList}>
          <ScrollView>
            {this.state.events.map(event => <Event key={event.id} event={event} />)}
          </ScrollView>
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  event: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 8,
  },
  eventData: {
    fontSize: 10,
    fontFamily: 'courier',
    color: '#555',
  },
  eventName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#222',
  },
  eventList: {
    position: 'absolute',
    top: height / 2,
    left: 0,
    right: 0,
    bottom: 0,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: height / 2,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

module.exports = DisplayLatLng;
