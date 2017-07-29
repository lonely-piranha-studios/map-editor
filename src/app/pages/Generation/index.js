import React from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid-v4';
import style from './style.scss';

class Generation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.mapRadius = 300;
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
    for (let i = 0; i < 200; i++) {
      this.rooms.push({
        id: uuid(),
        name: `map_${i}`,
        width: Math.floor(Math.random()*20 + 5),
        height: Math.floor(Math.random()*20 + 5),
        entryTop: !!(Math.random() > 0.2),
        entryBottom: !!(Math.random() > 0.2),
        entryLeft: !!(Math.random() > 0.2),
        entryRight: !!(Math.random() > 0.2),
      });
    }
    //this.rooms = Object.values(props.game.maps);
    this.mapGenerate();
  }

  mapGenerate() {
    this.generationRotation = 0;
    this.generationDistance = 10;
    this.mapWrite(this.spawn, 0, 0);
    for (let ind = 0; ind < this.rooms.length; ind++) {
      let success = false;
      while(!success) {
        const newX = Math.floor(this.generationDistance * Math.cos(this.generationRotation));
        const newY = Math.floor(this.generationDistance * Math.sin(this.generationRotation));
        if (!this.mapCollision(this.rooms[ind], newX, newY)) {
          this.mapWrite(this.rooms[ind], newX, newY);
          success = true;
        } else {
          this.generationRotation += 450 / (10 + this.generationDistance / 2) + Math.random() * 5;
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
      const xPos = this.mapRadius + x - 3 - mapXOrigo + (ind - Math.floor(ind/mapWidth) * mapWidth);
      const yPos = this.mapRadius + y - 3 - mapYOrigo + Math.floor(ind/mapWidth);
      if (this.mapCollide[xPos] && this.mapCollide[xPos][yPos]) {
        return true;
      }
    }
    return false;
  }

  entryDirectionValidate(type, x, y) {
    if (type === 'top' && y >= 0) { return false; }
    if (type === 'bottom' && y <= 0) { return false; }
    if (type === 'left' && x >= 0) { return false; }
    if (type === 'right' && x <= 0) { return false; }
    return true;
  }

  entryFind(type, x, y) {
    let maxDistance = 20; // max search distance
    let res = -1;
    for (let ind = 0; ind < this.availableEntries.length; ind++) {
      const distance = Math.hypot(this.availableEntries[ind].x-x, this.availableEntries[ind].y-y);
      if (distance < maxDistance) {
        if (this.entryDirectionValidate(type, this.availableEntries[ind].x-x, this.availableEntries[ind].y-y) && this.entryDirectionValidate(this.availableEntries[ind].type, x-this.availableEntries[ind].x, y-this.availableEntries[ind].y)) {
          maxDistance = distance;
          res = ind;
        }
      }
    }
    return res;
  }

  coridorDraw(x1, y1, x2, y2, type1, type2) {
    const distanceW = Math.abs(x1 - x2);
    const distanceH = Math.abs(y1 - y2);
    const xMin = Math.min(x1, x2);
    const yMin = Math.min(y1, y2);
    let type = distanceW > distanceH ? 'horizontal' : 'vertical';
    if (type1 === 'top' && type2 === 'bottom' || type2 === 'top' && type1 === 'bottom') { type = 'vertical'; }
    if (type1 === 'left' && type2 === 'right' || type2 === 'left' && type1 === 'right') { type = 'horizontal'; }
    if ((type1 === 'left' || type1 === 'right') && (type2 === 'top' || type2 === 'bottom')) { type = 'horizontal-bend'; }
    if ((type1 === 'top' || type1 === 'bottom') && (type2 === 'left' || type2 === 'right')) { type = 'vertical-bend'; }
    const color = '#00f';
    let drawX = x1;
    let drawY = y1;
    for (let step = 0; step < distanceW + distanceH; step++) {
      if (type === 'horizontal') {
        if (step >= distanceW/2 && drawY !== y2) {
          drawY += y1 > y2 ? -1 : 1;
        } else {
          drawX += x1 > x2 ? -1 : 1;
        }
      } else if (type === 'vertical') {
        if (step >= distanceH/2 && drawX !== x2) {
          drawX += x1 > x2 ? -1 : 1;
        } else {
          drawY += y1 > y2 ? -1 : 1;
        }
      } else if (type === 'horizontal-bend') {
        if (step >= distanceW) {
          drawY += y1 > y2 ? -1 : 1;
        } else {
          drawX += x1 > x2 ? -1 : 1;
        }
      } else if (type === 'vertical-bend') {
        if (step >= distanceH) {
          drawX += x1 > x2 ? -1 : 1;
        } else {
          drawY += y1 > y2 ? -1 : 1;
        }
      }
      const innerArr = this.mapCollide[drawX];
      if (!Array.isArray(innerArr)) {
        this.mapCollide[drawX] = [];
      }
      this.mapCollide[drawX][drawY]
        = color;
    }
    this.mapCollide[x1][y1] = '#00f';
    this.mapCollide[x2][y2] = '#00f';
  }

  mapWrite(map, x, y) {
    const mapXOrigo = Math.floor(map.width/2);
    const mapYOrigo = Math.floor(map.height/2);
    const color = '#afa';
    for (let ind = 0; ind < map.width*map.height; ind++) {
      const xPos = this.mapRadius + x - mapXOrigo + (ind - Math.floor(ind/map.width) * map.width);
      const yPos = this.mapRadius + y - mapYOrigo + Math.floor(ind/map.width);
      const innerArr = this.mapCollide[xPos];
      if (!Array.isArray(innerArr)) {
        this.mapCollide[xPos] = [];
      }
      this.mapCollide[xPos][yPos]
        = color; // read from map
    }
    let entries = [];
    if (map.entryTop) {
      const search = this.entryFind('top', this.mapRadius + x, this.mapRadius + y - mapYOrigo);
      if (search >= 0) {
        this.coridorDraw(this.mapRadius + x, this.mapRadius + y - mapYOrigo, this.availableEntries[search].x, this.availableEntries[search].y, 'top', this.availableEntries[search].type)
        //this.availableEntries.splice(search, 1)
      }
      entries.push({ type: 'top', x: this.mapRadius + x, y: this.mapRadius + y - mapYOrigo });
    }
    if (map.entryBottom) {
      const search = this.entryFind('bottom', this.mapRadius + x, this.mapRadius + y - mapYOrigo + map.height - 1);
      if (search >= 0) {
        this.coridorDraw(this.mapRadius + x, this.mapRadius + y - mapYOrigo + map.height - 1, this.availableEntries[search].x, this.availableEntries[search].y, 'bottom', this.availableEntries[search].type)
        //this.availableEntries.splice(search, 1)
      }
      entries.push({ type: 'bottom', x: this.mapRadius + x, y: this.mapRadius + y - mapYOrigo + map.height - 1 });
    }
    if (map.entryLeft) {
      const search = this.entryFind('left', this.mapRadius + x - mapXOrigo, this.mapRadius + y);
      if (search >= 0) {
        this.coridorDraw(this.mapRadius + x - mapXOrigo, this.mapRadius + y, this.availableEntries[search].x, this.availableEntries[search].y, 'left', this.availableEntries[search].type)
        //this.availableEntries.splice(search, 1)
      }
      entries.push({ type: 'left', x: this.mapRadius + x - mapXOrigo, y: this.mapRadius + y });
    }
    if (map.entryRight) {
      const search = this.entryFind('right', this.mapRadius + x - mapXOrigo + map.width - 1, this.mapRadius + y);
      if (search >= 0) {
        this.coridorDraw(this.mapRadius + x - mapXOrigo + map.width - 1, this.mapRadius + y, this.availableEntries[search].x, this.availableEntries[search].y, 'right', this.availableEntries[search].type)
        //this.availableEntries.splice(search, 1)
      }
      entries.push({ type: 'right', x: this.mapRadius + x - mapXOrigo + map.width - 1, y: this.mapRadius + y });
    }
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
          {/* this.availableEntries.map((e, ind) => <div key={ind} style={{ left: `${e.x}px`, top: `${e.y}px`, backgroundColor: 'red' }} className={style.pixel} />) */}
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  game: state.get('game').toJS()
});

export default connect(mapStateToProps)(Generation);
