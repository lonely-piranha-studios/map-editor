import React from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid-v4';
import style from './style.scss';

class Generation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.mapCollide = [];
    this.rooms = [];
    this.spawn = {
      id: uuid(),
      name: 'spawn',
      width: 11,
      height: 11,
      entryTop: true,
      entryBottom: true,
      entryLeft: true,
      entryRight: true,
    };
    this.availableEntries = [];
    for (let i = 0; i < 20; i++) {
      this.rooms.push({
        id: uuid(),
        name: `map_${i}`,
        width: Math.floor(Math.random()*20 + 5),
        height: Math.floor(Math.random()*20 + 5),
        entryTop: !!(Math.random() > 0.5),
        entryBottom: !!(Math.random() > 0.5),
        entryLeft: !!(Math.random() > 0.5),
        entryRight: !!(Math.random() > 0.5),
      });
    }
    this.mapGenerate();
  }

  mapGenerate() {
    this.generationRotation = 0;
    this.generationDistance = 10;
    this.mapWrite(this.spawn, 0, 0);
    for (let ind = 0; ind < this.rooms.length; ind++) {
      this.generationRotation = 0;
      let success = false;
      while(!success) {
        const newX = Math.floor(this.generationDistance * Math.cos(this.generationRotation));
        const newY = Math.floor(this.generationDistance * Math.sin(this.generationRotation));
        if (!this.mapCollision(this.rooms[ind], newX, newY)) {
          this.mapWrite(this.rooms[ind], newX, newY);
          success = true;
        } else {
          this.generationRotation += 450 / this.generationDistance;
          if (this.generationRotation >= 360) {
            this.generationRotation -= 360;
            this.generationDistance += 5;
          }
        }
      }
    }
  }

  mapCollision(map, x, y) {
    const mapXOrigo = Math.floor(map.width/2);
    const mapYOrigo = Math.floor(map.height/2);
    const mapWidth = map.width + 6;
    const mapHeight = map.height + 6;
    const tot = mapWidth * mapHeight;
    for (let ind = 0; ind < tot; ind++) {
      const xPos = 200 + x - 3 - mapXOrigo + (ind - Math.floor(ind/mapWidth) * mapWidth);
      const yPos = 200 + y - 3 - mapYOrigo + Math.floor(ind/mapWidth);
      if (this.mapCollide[xPos] && this.mapCollide[xPos][yPos]) {
        return true;
      }
    }
    return false;
  }

  entryFind(id, x, y) {
    let maxDistance = 20; // max search distance
    let res = -1;
    for (let ind = 0; ind < this.availableEntries.length; ind++) {
      if (this.availableEntries[ind].id !== id) {
        const distance = Math.hypot(this.availableEntries[ind].x-x, this.availableEntries[ind].y-y);
        if (distance < maxDistance) {
          maxDistance = distance;
          res = ind;
        }
      }
    }
    return res;
  }

  mapWrite(map, x, y) {
    const mapXOrigo = Math.floor(map.width/2);
    const mapYOrigo = Math.floor(map.height/2);
    const color = '#afa';
    for (let ind = 0; ind < map.width*map.height; ind++) {
      const xPos = 200 + x - mapXOrigo + (ind - Math.floor(ind/map.width) * map.width);
      const yPos = 200 + y - mapYOrigo + Math.floor(ind/map.width);
      const innerArr = this.mapCollide[xPos];
      if (!Array.isArray(innerArr)) {
        this.mapCollide[xPos] = [];
      }
      this.mapCollide[xPos][yPos]
        = color; // read from map
    }
    let entries = [];
    if (map.entryTop) {
      const search = this.entryFind(map.id, 200 + x, 200 + y - mapYOrigo);
      if (search >= 0) {
        console.info('FOUND PARTNER');
        this.mapCollide[200 + x][200 + y - mapYOrigo] = '#00f';
      } else {
        entries.push({ mapId: map.id, x: 200 + x, y: 200 + y - mapYOrigo });
      }
    }
    if (map.entryBottom) { entries.push({ mapId: map.id, x: 200 + x, y: 200 + y - mapYOrigo + map.height - 1 }); }
    if (map.entryLeft) { entries.push({ mapId: map.id, x: 200 + x - mapXOrigo, y: 200 + y }); }
    if (map.entryRight) { entries.push({ mapId: map.id, x: 200 + x - mapXOrigo + map.width - 1, y: 200 + y }); }
    this.availableEntries.push(...entries);
  }

  render() {
    return (
      <div>
        GENERATE!
        <div style={{ position: 'relative' }}>
          {this.mapCollide.map((v, x) => v.map((color, y) =>
            <div key={`${x}x${y}`} style={{ left: `${x}px`, top: `${y}px`, backgroundColor: color }} className={style.pixel} />
          ))}
          {this.availableEntries.map((e, ind) => <div key={ind} style={{ left: `${e.x}px`, top: `${e.y}px`, backgroundColor: 'red' }} className={style.pixel} />)}
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  game: state.get('game').toJS()
});

export default connect(mapStateToProps)(Generation);
