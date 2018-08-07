package com.example.bpmproxy.invoker;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

import jdk.nashorn.api.scripting.JSObject;

public class Variables {

	public static String getValue(JSONObject obj, String varName) {
		return getValue(obj, varName, false);
	}
	public static String getValue(JSONObject obj, String varName, boolean isXml) {
		String[] fields = varName.split("\\.");
		return getValue( obj, fields, isXml );
	}
	
	public static void setValue(JSONObject obj, String varName, Object value) {
		String[] fields = varName.split("\\.");
		setValue(obj, fields, value );
	}

	public static JSONArray isJSONArray(String str) {
		try {
			return new JSONArray(str);
		} catch (JSONException e) {
		}
		return null;
	}

	public static JSONObject isJSONObject(String str) {
		try {
			return new JSONObject(str);
		} catch (JSONException e) {
		}
		return null;
	}

	private static String[] shift(String[] fields) {
		String[] rc = new String[fields.length-1];
		System.arraycopy(fields, 1, rc, 0, rc.length);
		return rc;
	}

	private static boolean isArray(String string) {
		return string.contains("[");
	}

	private static String getValue(JSONObject obj, String[] fields, boolean isXml) {
		if( obj != null ) {
			if( fields.length == 1 ) {
				Object value = obj.opt(fields[0]);
				if( value != null ) {
					if( isXml && (value instanceof JSONObject  || value instanceof JSONArray)) {
						return XML.toString(value);
					}
					return isXml ? "[!CDATA["+value.toString()+"]]" : value.toString();
				}
				return null;
			}

			if( isArray(fields[0]) ) {
				String field = fields[0].substring(0, fields[0].indexOf("[")-1);
				Integer index = Integer.valueOf( fields[0].substring(fields[0].indexOf("[")+1, fields[0].indexOf("]")-1) );
				JSONArray array = obj.optJSONArray(field);
				if( array != null  &&  array.length() < index ) {
					return getValue( array.optJSONObject(index), shift(fields), isXml );
				}
			} else {
				return getValue( obj.optJSONObject(fields[0]), shift(fields), isXml );
			}
		}
		
		return null;
	}
	
	private static void setValue(JSONObject obj, String[] fields, Object value) {
		if( fields.length == 1 ) {
			if( isArray(fields[0]) ) {
				String field = fields[0].substring(0, fields[0].indexOf("[")-1);
				Integer index = Integer.valueOf( fields[0].substring(fields[0].indexOf("[")+1, fields[0].indexOf("]")-1) );
				JSONArray array = obj.optJSONArray(field);
				if( array == null ) {
					obj.put(field, array = new JSONArray());
				}
				array.put(index, value);
			} else {
				obj.put(fields[0], value);
			}
			return;
		}

		if( isArray(fields[0]) ) {
			String field = fields[0].substring(0, fields[0].indexOf("[")-1);
			Integer index = Integer.valueOf( fields[0].substring(fields[0].indexOf("[")+1, fields[0].indexOf("]")-1) );
			JSONArray array = obj.optJSONArray(field);
			if( array == null ) {
				obj.put(field, array = new JSONArray());
			}
			JSONObject object;
			array.put(index, object = new JSONObject());
			setValue( object, shift(fields), value );
		} else {
			if( obj.optJSONObject(fields[0]) == null ) {
				obj.put(fields[0], new JSONObject());
			}
			setValue( obj.optJSONObject(fields[0]), shift(fields), value );
		}
	}

	public static Object convertJS2JSON(Object obj) {
		if( obj instanceof JSObject ) {
			JSObject jsObject = (JSObject) obj;
			if (jsObject.isArray()) {
				JSONArray jsonArray = new JSONArray();
				convertArray(jsonArray, jsObject);
				return jsonArray;
			} else {
				JSONObject jsonObject = new JSONObject();
				convertObject(jsonObject, jsObject);
				return jsonObject;
			}
		} else if ( obj != null ) {
			return obj;
		}
		return null;
	}

	private static void convertObject(JSONObject o, JSObject obj) {
		obj.keySet().forEach(key->{
			final Object value = obj.getMember(key);
			if( value instanceof JSObject ) {
				JSObject val = (JSObject)value;
				if( val.isArray() ) {
					JSONArray o1 = new JSONArray();
					convertArray(o1, val);
					o.put(key, o1);
				} else {
					JSONObject o1 = new JSONObject();
					convertObject(o1, val);
					o.put(key, o1);
				}
			} else {
				o.put(key, value);
			}
		});
	}

	private static void convertArray(JSONArray arr, JSObject val) {
		val.keySet().forEach(key->{
			final Object value = val.getMember(key);
			if( value instanceof JSObject ) {
				JSObject val1 = (JSObject)value;
				if( val1.isArray() ) {
					JSONArray o1 = new JSONArray();
					convertArray(o1, val1);
					arr.put(Integer.valueOf(key), o1);
				} else {
					JSONObject o1 = new JSONObject();
					convertObject(o1, val1);
					arr.put(Integer.valueOf(key), o1);
				}
			} else {
				arr.put(Integer.valueOf(key), value);
			}
		});
	}
	
}
