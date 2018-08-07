package com.example.bpmproxy.controller;

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.bpmproxy.utils.DecodeEncodeUtil;
import com.example.bpmproxy.utils.RestTemplateFactory;

/**
 * @author Alexander Novogrodsky.
 */
@Controller
public class ProxyController {

    @Value("${proxy.url}")
    private String baseUrl;

    @Value("${proxy.login}")
    private String login;

    @Value("${proxy.password}")
    private String password;

    @RequestMapping(path = "/rest/bpm/wle/v1/**")
    void proxy2services(@RequestBody(required = false) String body, HttpServletRequest req, HttpServletResponse resp)
            throws IOException {
        final String query = req.getQueryString();

        String url = baseUrl + req.getRequestURI() + ((query != null && !query.isEmpty()) ? "?" + query : "");

        final HttpHeaders reqHeaders = new HttpHeaders();

        reqHeaders.add(HttpHeaders.AUTHORIZATION, "Basic " + DecodeEncodeUtil.encodeBase64(login+":"+password));

        if (!HttpMethod.GET.equals(HttpMethod.valueOf(req.getMethod()))) {
            final String header = HttpHeaders.CONTENT_TYPE;
            Enumeration<String> values = req.getHeaders(header);
            while (values.hasMoreElements()) {
                final String value = values.nextElement();
                reqHeaders.add(header, value);
            }
        }

        if (req.getHeader(HttpHeaders.ORIGIN) != null) {
            reqHeaders.add(HttpHeaders.ORIGIN, baseUrl);
        }

        HttpEntity<String> entity = new HttpEntity<String>(body, reqHeaders);
        final ResponseEntity<byte[]> respEntity = RestTemplateFactory.createRestTemplate().exchange(url, HttpMethod.valueOf(req.getMethod()), entity, byte[].class);
        byte[] payload = respEntity.getBody();

        final HttpHeaders headers = respEntity.getHeaders();

        headers.keySet().stream().filter("content-type"::equalsIgnoreCase).forEach(k -> headers.get(k).forEach(v -> resp.setHeader(k, v)));

            if( headers.getContentType().isCompatibleWith(MediaType.TEXT_HTML) ){
                String b = new String(payload, "UTF-8");
                payload = b.getBytes("UTF-8");
            } else if( headers.getContentType().isCompatibleWith(MediaType.APPLICATION_JSON) ){
                String b = new String(payload, "UTF-8");
                payload = b.getBytes("UTF-8");
            }

        resp.getOutputStream().write(payload);
        resp.setStatus(respEntity.getStatusCodeValue());
    }
}

