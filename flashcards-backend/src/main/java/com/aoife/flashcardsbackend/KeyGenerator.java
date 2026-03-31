package com.aoife.flashcardsbackend;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Encoders;

import javax.crypto.SecretKey;

public class KeyGenerator {
    public static void main(String[] args) {
        SecretKey key = Jwts.SIG.HS256.key().build();
        System.out.println(Encoders.BASE64.encode(key.getEncoded()));
    }
}