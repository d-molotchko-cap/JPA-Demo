package com.example.bpmproxy.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

// TODO: implement converter for Camunda.
public class JSONUtils {

	private static final String modelPackageName = ".model.";

	public static String convertFromCamunda(JSONArray json, String dateFormat) {
		final JSONObject internal = new JSONObject();
		json.forEach(variable -> {
			JSONObject obj = (JSONObject) variable;
			if( obj != null ) {
				String type = obj.optString("type");
				if (type != null) {
					String name = obj.optString("name");
					String value = obj.optString("value");
					if( "Object".equalsIgnoreCase(type) ) {
						if (value != null) {
							if (value.startsWith("{")) {
								internal.put(name, new JSONObject(value));
							} else if (value.startsWith("[")) {
								internal.put(name, new JSONArray(value));
							}
						}
					} else {
						internal.put(name, value);
					}
				}
			}
		});
		transformDates(internal, dateFormat);
		return internal.toString();
	}

	/*
	 * inputs: json
	 * {
	 *   "varname1" : {
	 *   	type: "Primitive|Json",
	 *   	value: "Primitive|json in string"
	 *   },
	 *   "var2" : {
	 *     	type: "Primitive|Json",
	 *   	value: "Primitive|json in string"
	 * 	  }
	 * }
	 * 
	 * 
	 * */
	public static String convertFromCamunda(JSONObject json) {
		final JSONObject internal = new JSONObject();
		String[] keys = JSONObject.getNames(json);
		if( keys != null ) {
			for( String key : keys ) {
				JSONObject obj = json.optJSONObject(key);
				String value = obj.optString("value");
				if( obj != null ) {
					if( "Object".equalsIgnoreCase(obj.optString("type")) ) {
						if (value.startsWith("{")) {
							internal.put(key, new JSONObject(value));
						} else if (value.startsWith("[")) {
							internal.put(key, new JSONArray(value));
						}
					} else {
						internal.put(key, value);
					}
				}
			}
		}
		return internal.toString();
	}

	/*
	 * inputs: json
	 * 
	 * {
	 *   "var1" : {},
	 *   "var2" : "234",
	 *   "var3" : 234
	 * }
	 * 
	 */
	public static JSONObject convertToCamunda(JSONObject json) {
		final JSONObject camunda = new JSONObject();
		String[] keys = JSONObject.getNames(json);
		if( keys != null ) {
			for( String key : keys ) {
				Object val = json.opt(key);
				if( val != null ) {
					JSONObject description = new JSONObject();
					if( val instanceof JSONObject || val instanceof JSONArray) {
						String objTypeName = modelPackageName + Character.toUpperCase(key.charAt(0)) + key.substring(1);
						if( val instanceof JSONArray ) {
							objTypeName = "java.util.ArrayList<" + objTypeName + ">";
						}

						final JSONObject valueInfo = new JSONObject();
						valueInfo.put("serializationDataFormat", "application/json");
						valueInfo.put("objectTypeName", objTypeName);
						description.put("value", val.toString());
						description.put("type", "Object");
						description.put("valueInfo", valueInfo);
					} else if( val instanceof String ) {
						description.put("value", val.toString());
						description.put("type", "string");
					} else if( val instanceof Integer ) {
						description.put("value", val);
						description.put("type", "integer");
					} else if( val instanceof Float || val instanceof Double ) {
						description.put("value", val);
						description.put("type", "double");
					} else if( val instanceof Date ) {
						description.put("value", val.toString());
						description.put("type", "date");
					} else if( val instanceof Boolean ) {
						description.put("value", val);
						description.put("type", "boolean");
					}
					camunda.put(key, description);
				}
			}
		}
		return camunda;
	}

	public static String convertToStartBPMStructure(String processName, String body) {
		final JSONObject vars = new JSONObject(body);
		
		final JSONArray inputArray = new JSONArray();
		for( String key: vars.keySet() ) {
			inputArray.put(transformObjectToStartBPMStructure(key, vars.getJSONObject(key)));
		}
		
		final JSONObject params = new JSONObject();
		params.put("processName", processName);
		if( inputArray.length() > 0 ) {
			params.put("input", inputArray);
		}
		
		try {
			return URLEncoder.encode(params.toString(), "UTF8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			params.remove("input");
		}
		return params.toString();
	}

	private static JSONObject transformObjectToStartBPMStructure(String name, JSONObject obj) {
		Map<String, String> var2type = new HashMap<String, String>() {{
			
		}};
		
		Map<String, Boolean> var2array = new HashMap<String, Boolean>() {{
			
		}};
		
		final JSONObject param = new JSONObject();
		param.put("name", name);
		param.put("type", var2type.get(name));
		param.put("value", obj.toString());
		param.put("isList", var2array.get(name));
		return param;
	}
	

	private static void transformDates(JSONObject object, String dateFormat) {
		String[] fields = JSONObject.getNames(object);
		for( int f=0;  fields != null  &&  f < fields.length;  ++f ) {
			Object value = object.opt(fields[f]);
			if( value instanceof JSONObject ) {
				transformDates((JSONObject) value, dateFormat);
			} else if( value instanceof JSONArray ) {
				transformDates((JSONArray) value, dateFormat);
			} else if (value != null) {
				Date date = null;
				if( value instanceof Long ) {
					if( (Long)value > 1000000000 ) {
						date = new Date((Long)value);
					}
				} else if( value instanceof String && dateFormat != null  &&  !dateFormat.isEmpty()) {
					try {
						SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
						date = sdf.parse((String)value);
					} catch(Throwable e) {
					}
				}
				
				if( date != null ) {
					SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
					object.put(fields[f], sdf.format(date));
				}
			}
		}
	}

	private static void transformDates(JSONArray array, String dateFormat) {
		for( int i=0;  array != null  &&  i<array.length();  ++i ) {
			final String v = array.get(i).toString();
			
			JSONArray arr;
			JSONObject object;
			
			if( (arr = isJSONArray(v)) != null ) {
				transformDates(arr, dateFormat);
			} else if( (object = isJSONObject(v)) != null ) {
				transformDates(object, dateFormat);
			}
		}
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
	
}
