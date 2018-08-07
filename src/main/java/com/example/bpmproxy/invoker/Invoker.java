package com.example.bpmproxy.invoker;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.net.ssl.*;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;

public class Invoker {

	private static final String PATTERN_CURLY_BRACKETS = "\\{((?:[^\\{\\}]|\\{\\{[^\\}]*\\}\\})*)\\}";

	static {
		TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager(){
			public X509Certificate[] getAcceptedIssuers(){return null;}
			public void checkClientTrusted(X509Certificate[] certs, String authType){}
			public void checkServerTrusted(X509Certificate[] certs, String authType){}
		}};
		SSLContext sslContext = null;
		try {
			sslContext = SSLContext.getInstance("TLS");
			sslContext.init(null, trustAllCerts, new SecureRandom());
			HostnameVerifier allHostsValid = new HostnameVerifier() {
				public boolean verify(String hostname, SSLSession session) {
					return true;
				}
			};
			HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
			HttpsURLConnection.setDefaultSSLSocketFactory(sslContext.getSocketFactory());
		} catch (NoSuchAlgorithmException e1) {
			e1.printStackTrace();
		} catch (KeyManagementException e) {
			e.printStackTrace();
		}
	}

	private static void initVarInScript(ScriptEngine js, JSONObject variables, String varName) {
		if (varName != null) {
			String value = Variables.getValue(variables, varName);
			if (value != null && !isJsonValid(value)) {
				value = "'" + value + "'";
			}
			final String str = "var " + varName + " = " + value + ";";
			try {
				js.eval(str);
			} catch (ScriptException e) {
				e.printStackTrace();
			}
		}
	}

	public static void invokeMapperWithExceptionThrowing (JSONObject variables, String[] inputs, String[] outputs, String code, String initCode) throws ScriptException {
		ScriptEngine js = new ScriptEngineManager().getEngineByName("javascript");
		// set inputs
		for( String input : inputs ) {
			initVarInScript(js, variables, input);
		}

		if (initCode != null) {
			js.eval(initCode);
		}
		// execute mapper
		js.eval(code);

		// set values
		for(String output: outputs) {
			Variables.setValue(variables, output, Variables.convertJS2JSON(js.get(output)));
		}
	}

	public static void invokeMapper(JSONObject variables, String[] inputs, String[] outputs, String code, String initCode) {
		try {
			invokeMapperWithExceptionThrowing(variables, inputs, outputs, code, initCode);
		} catch (ScriptException e) {
			e.printStackTrace();
		}
	}

	public static void invokeMapper(JSONObject variables, String[] inputs, String[] outputs, String code) {
		invokeMapper(variables, inputs, outputs, code, null);
	}

	public static String invokeGatewayWithExceptionThrowing(JSONObject variables, Map<String, String> expressionMap) throws ScriptException {
		ScriptEngine js = new ScriptEngineManager().getEngineByName("javascript");
		if (variables != null) {
			Set variableNameSet = variables.keySet();
			if (variableNameSet != null) {
				variableNameSet.forEach(variableName -> {
					if (variableName != null) {
						initVarInScript(js, variables, (String)variableName);
					}
				});
			}

			if (expressionMap != null) {
				for (Entry<String, String> expressionMapEntry : expressionMap.entrySet()) {
					if (expressionMapEntry.getValue() != null && expressionMapEntry.getKey() != null) {
						if ((boolean)js.eval(expressionMapEntry.getValue())) {
							return expressionMapEntry.getKey();
						}
					}
				}
			}
		}
		return null;
	}

	public static String invokeGateway(JSONObject variables, Map<String, String> expressionMap) {
		try {
			return invokeGatewayWithExceptionThrowing(variables, expressionMap);
		} catch (ScriptException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static void invokeMock(JSONObject variables, String[] outputs, String code) {
		ScriptEngine js = new ScriptEngineManager().getEngineByName("javascript");
		for( String output : outputs ) {
			final String str = "var "+output+" = " + code;
			try {
				js.eval(str);
				Variables.setValue(variables, outputs[0], Variables.convertJS2JSON(js.get(output)));
			} catch (ScriptException e) {
				e.printStackTrace();
			}
			break;
		}
	}

	public static void invokeRestWithExceptionThrowing(String method, String url, String body, Map<String, String> headers, JSONObject variables, String[] outputs, String dateFormat) throws IOException {
		HttpURLConnection con = null;
		ByteArrayOutputStream baos = null;
		BufferedInputStream in = null;

		try {
			URL obj = new URL(substitute(variables, url, true));
			con = (HttpURLConnection) obj.openConnection();
			con.setRequestMethod(method);

			if( headers != null ) {
				Iterator<Entry<String, String>> it = headers.entrySet().iterator();
				while( it.hasNext() ) {
					Entry<String, String> item = it.next();
					con.setRequestProperty(substitute(variables, item.getKey(), false), substitute(variables, item.getValue(), false));
				}
			}

			if( "POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method)) {
				if( body != null ) {
					//invocation of getRequestProperties() after setDoOutput(true) causes "Already connected" exception
					boolean isXml = isXml(con.getRequestProperties());
					con.setDoOutput(true);
					String bodyStr = substitute(variables, body, isXml);
					if (con.getRequestProperty("Content-Type") == null) {
						String contentType = null;
						if (isXml) {
							contentType = "application/xml";
						} else if (isJsonValid(bodyStr)) {
							contentType = "application/json";
						} else {
							contentType = "application/json";
						}
						if (contentType != null) {
							con.setRequestProperty("Content-Type", contentType);
						}
					}
					con.getOutputStream().write(bodyStr.getBytes(StandardCharsets.UTF_8));
				}
			}

			int responseCode = con.getResponseCode();
			if( responseCode >= 200  &&  responseCode < 300 ) {
				baos = new ByteArrayOutputStream();
				in = new BufferedInputStream(con.getInputStream());

				byte[] buff = new byte[16384];
				int c;
				while( (c=in.read(buff, 0, 16384)) != -1 ) {
					baos.write(buff, 0, c);
				}
				if( outputs.length > 0 ) {
					String response = new String(baos.toByteArray(), (con.getContentEncoding() != null) ? Charset.forName(con.getContentEncoding()) : StandardCharsets.UTF_8 );

					if( "application/xml".equalsIgnoreCase(con.getContentType()) ) {
						XmlMapper mapper = new XmlMapper();
						Map<String, Object> objResp = (Map<String, Object>) mapper.readValue(response, Object.class);
						response = convertMapToJSON(objResp).toString();
					}

					JSONArray array;
					JSONObject object;
					if( (array = Variables.isJSONArray(response)) != null ) {
						transformDates(array, dateFormat);
						Variables.setValue(variables, outputs[0], array);
					} else if( (object = Variables.isJSONObject(response)) != null ) {
						transformDates(object, dateFormat);
						Variables.setValue(variables, outputs[0], object);
					} else {
						Variables.setValue(variables, outputs[0], response);
					}
				}
			} else if( (responseCode >= 300  &&  responseCode <= 303) || responseCode == 307 ) {
				invokeRest( method, con.getHeaderField("Location"), body, null, variables, outputs, dateFormat );
			} else {
				throw new IOException("HTTP Exception, Response Status: " + responseCode);
			}
		} catch (MalformedURLException e) {
			throw e;
		} catch (IOException e) {
			throw e;
		} finally {
			try {
				if( baos != null ) {
					baos.close();
				}
				if( in != null ) {
					in.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
			if(con != null ){
				con.disconnect();
			}
		}
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
			
			if( (arr = Variables.isJSONArray(v)) != null ) {
				transformDates(arr, dateFormat);
			} else if( (object = Variables.isJSONObject(v)) != null ) {
				transformDates(object, dateFormat);
			}
		}
	}

	public static void invokeRest(String method, String url, String body, Map<String, String> headers, JSONObject variables, String[] outputs, String dateFormat) {
		try {
			invokeRestWithExceptionThrowing(method, url, body, headers, variables, outputs, dateFormat);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private static JSONObject convertMapToJSON(Map<String, Object> objResp) {
		JSONObject obj = new JSONObject();
		convertToJSON(obj, objResp);
		return obj;
	}

	private static void convertToJSON(JSONObject obj, Map<String, Object> objResp) {
		for( Map.Entry<String, Object> entry : objResp.entrySet() ) {
			final Object value = entry.getValue();
			if( value instanceof List ) {
				JSONArray array = new JSONArray();
				for( Object val2: (List<?>)value ) {
					JSONObject obj2 = new JSONObject();
					convertToJSON(obj2, (Map<String, Object>) val2);
					array.put(obj2);
				}
				obj.put(entry.getKey(), array);
			} else if( value instanceof Map ) {
				JSONObject obj2 = new JSONObject();
				convertToJSON(obj2, (Map<String, Object>) value);
				obj.put(entry.getKey(), obj2);
			} else {
				obj.put(entry.getKey(), value);
			}
		}
	}

	private static boolean isXml(Map<String, List<String>> requestProperties) {
		List<String> props = requestProperties.get("Content-Type");
		if (props != null) {
			for( String val : props ) {
				if( val != null  &&  val.contains("xml") ) {
					return true;
				}
			}
		}
		return false;
	}

	public static String substitute(JSONObject variables, String string, boolean encode) {
		return substitute(variables, string, encode, false);
	}

	public static String substitute(JSONObject variables, String string, boolean encode, boolean isXml) {
		Matcher m = Pattern.compile(PATTERN_CURLY_BRACKETS).matcher(string);
		Map<String, String> replaceMap = new HashMap<>();
		while (m.find()) {
			String injectableStr = m.group();
			String paramName = m.group(1);
			if (!isJsonValid(injectableStr) && !replaceMap.containsKey(paramName)) {
				final String replaceTo = Variables.getValue(variables, paramName, isXml);
				replaceMap.put(paramName, replaceTo);
			}
		}
		for (Entry<String, String> entry : replaceMap.entrySet()) {
			try {
				string = string.replace("{" + entry.getKey() + "}", entry.getValue() == null?"": !encode ? entry.getValue() : URLEncoder.encode(entry.getValue(), "UTF-8"));
			} catch (UnsupportedEncodingException e) {
				e.printStackTrace();
			}
		}
		return string;
	}

	public static boolean isJsonValid(String test) {
		if (test == null) {
			return false;
		}
		try {
			new JSONObject(test);
		} catch (JSONException ex) {
			try {
				new JSONArray(test);
			} catch (JSONException ex1) {
				return false;
			}
		}
		return true;
	}

	public static String makeVariables(JSONObject variables, String[] vars) {
		JSONObject rc = new JSONObject();
		for( String out : vars ) {
			rc.put(out, variables.opt(out));
		}
		return rc.toString();
	}
}
