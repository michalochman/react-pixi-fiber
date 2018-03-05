import * as PIXI from "pixi.js";
import {
  filterByKey,
  including,
  includingReservedProps,
  isPointType,
  not,
  parsePoint,
  setPixiValue,
} from "../src/utils";
import { RESERVED_PROPS } from "../src/props";

describe("not", () => {
  it("returns a function", () => {
    expect(typeof not()).toEqual("function");
  });

  it("calls wrapped function when called", () => {
    const fn = jest.fn();
    not(fn)();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("negates wrapped function return value", () => {
    const returnTrue = jest.fn(() => true);
    const returnFalse = jest.fn(() => false);

    expect(not(returnTrue)()).toBeFalsy();
    expect(not(returnFalse)()).toBeTruthy();
  });
});

describe("filterByKey", () => {
  it("should return an object when called with object and function", () => {
    expect(typeof filterByKey({}, jest.fn())).toEqual("object");
  });

  it("should return an object with keys matching filter only", () => {
    const obj = {
      foo: 1,
      bar: 2,
      baz: 3,
    };
    const fooOnly = jest.fn(key => key === "foo");
    const withoutFoo = jest.fn(key => key !== "foo");

    expect(filterByKey(obj, fooOnly)).toEqual({
      foo: 1,
    });
    expect(fooOnly).toHaveBeenCalledTimes(Object.keys(obj).length);

    expect(filterByKey(obj, withoutFoo)).toEqual({
      bar: 2,
      baz: 3,
    });
    expect(withoutFoo).toHaveBeenCalledTimes(Object.keys(obj).length);
  });
});

describe("including", () => {
  it("returns a function", () => {
    expect(typeof including()).toEqual("function");
  });

  it("returns true if wrapped array contains value", () => {
    const havingFoo = { foo: "bar" };

    expect(including(Object.keys(havingFoo))("foo")).toBeTruthy();
  });

  it("returns false if wrapped array does not contain value", () => {
    const notHavingBaz = ["foo", "bar"];

    expect(including(Object.keys(notHavingBaz))("baz")).toBeFalsy();
  });
});

describe("includingReservedProps", () => {
  it("returns true if prop is not one of DisplayObject members", () => {
    Object.keys(RESERVED_PROPS).forEach(propName => {
      expect(includingReservedProps(propName)).toBeTruthy();
    });
  });

  it("returns false if prop is not one of RESERVED_PROPS", () => {
    expect(includingReservedProps("anchor")).toBeFalsy();
    expect(includingReservedProps("style")).toBeFalsy();
    expect(includingReservedProps("width")).toBeFalsy();
  });
});

describe("parsePoint", () => {
  it("returns array", () => {
    expect(parsePoint()).toHaveLength(0);
  });

  it("returns array of strings split by comma if value is a string", () => {
    expect(parsePoint("13,37")).toEqual([13, 37]);
  });

  it("returns array with single number if value is a number", () => {
    expect(parsePoint(42)).toEqual([42]);
  });

  it("returns copy of an array if value is an array", () => {
    expect(parsePoint([100, 10])).toEqual([100, 10]);
  });

  it("returns array with x and y from object if value is an object with x and y members", () => {
    expect(parsePoint({ x: 1, y: 0 })).toEqual([1, 0]);
  });

  it("returns empty array otherwise", () => {
    expect(parsePoint(false)).toEqual([]);
  });
});

describe("isPointType", () => {
  const x = 100;
  const y = 50;

  it("returns true if value is instance of PIXI.Point", () => {
    expect(isPointType(new PIXI.Point(x, y))).toBeTruthy();
  });
  it("returns true if value is instance of PIXI.ObservablePoint", () => {
    expect(isPointType(new PIXI.ObservablePoint(jest.fn, null, x, y))).toBeTruthy();
  });
  it("returns false if value is not instance of PIXI.Point or PIXI.ObservablePoint", () => {
    expect(isPointType(`${x},${y}`)).toBeFalsy();
  });
});

describe("setPixiValue", () => {
  /*
  export function setPixiValue(instance, propName, value) {
    if (isPointType(instance[propName])) {
      // Parse value if a non-Point type is being assigned to a Point type
      const coordinateData = parsePoint(value);

      invariant(
        typeof coordinateData !== "undefined" && coordinateData.length > 0 && coordinateData.length < 3,
        "The property `%s` is a PIXI.Point or PIXI.ObservablePoint and must be set to a comma-separated string of " +
          "either 1 or 2 coordinates, a 1 or 2 element array containing coordinates, or a PIXI Point/ObservablePoint. " +
          "If only one coordinate is given then X and Y will be set to the provided value. Received: `%s` of type `%s`.",
        propName,
        JSON.stringify(value),
        typeof value
      );

      instance[propName].set(coordinateData.shift(), coordinateData.shift());
    } else {
      // Just assign the value directly if a non-Point type is being assigned to a non-Point type
      instance[propName] = value;
    }
  }

   */
  it("copies value if current and next value are point types", () => {
    class JestPoint extends PIXI.Point {}
    JestPoint.prototype.copy = jest.fn(PIXI.Point.prototype.copy);
    const obj = {
      test: new JestPoint(0, 0),
    };
    const test = new PIXI.Point(13, 37);

    setPixiValue(obj, "test", test);
    expect(JestPoint.prototype.copy).toHaveBeenCalledTimes(1);
    expect(JestPoint.prototype.copy).toHaveBeenCalledWith(test);
    expect(obj.test).toEqual(new PIXI.Point(13, 37));
  });

  it("parses next value and sets current if only current value is point", () => {
    class JestPoint extends PIXI.Point {}
    JestPoint.prototype.set = jest.fn(PIXI.Point.prototype.set);
    const obj = {
      test: new JestPoint(0, 0),
    };
    setPixiValue(obj, "test", "13,37");
    expect(JestPoint.prototype.set).toHaveBeenCalledTimes(1);
    expect(JestPoint.prototype.set).toHaveBeenCalledWith(13, 37);
    expect(obj.test).toEqual(new PIXI.Point(13, 37));
  });

  it("assigns value directly if neither current nor next value are point types", () => {
    const obj = {};
    const value = "value";
    expect(obj.test).not.toEqual(value);
    setPixiValue(obj, "test", value);
    expect(obj.test).toEqual(value);
  });

  it("throws if current value is point and next value is not point-like", () => {
    const obj = {
      test: new PIXI.Point(0, 0),
    };
    expect(() => setPixiValue(obj, "test", false)).toThrow();
  });
});
