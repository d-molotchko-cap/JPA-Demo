package com.example.bpmproxy.utils;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.ResponseErrorHandler;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriTemplateHandler;

public class RestTemplateFactory {

    final private static RestTemplate restTemplate = new RestTemplate();
    final private static HttpClient httpClient; 

    static {
        final List<ClientHttpRequestInterceptor> interceptors = new ArrayList<ClientHttpRequestInterceptor>();
        final HttpComponentsClientHttpRequestFactory requestFactory = new HttpComponentsClientHttpRequestFactory();

        TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
            public X509Certificate[] getAcceptedIssuers() {
                return null;
            }

            public void checkClientTrusted(X509Certificate[] certs, String authType) {
            }

            public void checkServerTrusted(X509Certificate[] certs, String authType) {
            }
        }};

        SSLContext sslContext = null;
        try {
        	sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, trustAllCerts, new SecureRandom());
        } catch (NoSuchAlgorithmException | KeyManagementException e1) {
            e1.printStackTrace();
        }

        httpClient = HttpClientBuilder.create()
//                .disableRedirectHandling()
                .setSSLHostnameVerifier((s, sslSession) -> true).setSSLContext(sslContext).build();

        requestFactory.setHttpClient(httpClient);

        restTemplate.setErrorHandler(new ResponseErrorHandler() {
            @Override
            public boolean hasError(ClientHttpResponse response) throws IOException {
                return false;
            }

            @Override
            public void handleError(ClientHttpResponse response) throws IOException {
            }
        });
        restTemplate.setRequestFactory(requestFactory);
        restTemplate.setInterceptors(interceptors);
        restTemplate.setUriTemplateHandler(new UriTemplateHandler() {

            @Override
            public URI expand(String uriTemplate, Object... uriVariableValues) {
                try {
                    return new URI(uriTemplate);
                } catch (URISyntaxException e) {
                    e.printStackTrace();
                }
                return null;
            }

            @Override
            public URI expand(String uriTemplate, Map<String, ?> uriVariables) {
                try {
                    return new URI(uriTemplate);
                } catch (URISyntaxException e) {
                    e.printStackTrace();
                }
                return null;
            }
        });
    }
	
	
	static public RestTemplate createRestTemplate() {
		return restTemplate;
	}
	
    static public HttpClient get(){
        return httpClient;
    }
	
	
}
