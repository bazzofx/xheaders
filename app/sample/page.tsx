"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { parseEmailHeader } from "@/lib/email-parser"

export default function SamplePage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Generate a sample header
      const sampleHeader = `Received: from mail-wr1-f54.google.com (mail-wr1-f54.google.com [209.85.221.54])
      by mx.example.com (Postfix) with ESMTPS id 45B7C264312
      for <recipient@example.com>; Mon, 3 Apr 2023 15:23:40 -0700 (PDT)
Received: by mail-wr1-f54.google.com with SMTP id a16-20020a170902f70400b001d5e77b6d5eso2874336wmq.1
      for <recipient@example.com>; Mon, 03 Apr 2023 15:23:40 -0700 (PDT)
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
      d=gmail.com; s=20210112; t=1680559419; x=1683151419;
      h=to:subject:message-id:date:mime-version:from:from:to:cc:subject
       :date:message-id:reply-to;
     bh=KJU4JJuVvxgQXEXdT7U0ZKn9Jl+uF0AKtjw+Kpe6+b4=;
     b=Yx8Jz9iZeXxKgA5vbIY9Hl1q3O9JZVjmKLHg+6t1B1JQY1wGDHiNgEcTDGZZQPkqHw
      Ux/AfBKzwvBiDzUCMBYRB0xGfQRgq8fJYgHbVXYUrLSg1Oy+N1XZlEBiKIrJs+QQYeJP
      Ot/Hl9qzK9q5qQP1NfLoEXHAYIXqGgMcJwXQQ=
X-Google-DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
     d=1e100.net; s=20210112; t=1680559419; x=1683151419;
     h=to:subject:message-id:date:from:mime-version:x-gm-message-state
      :from:to:cc:subject:date:message-id:reply-to;
     bh=KJU4JJuVvxgQXEXdT7U0ZKn9Jl+uF0AKtjw+Kpe6+b4=;
     b=Yx8Jz9iZeXxKgA5vbIY9Hl1q3O9JZVjmKLHg+6t1B1JQY1wGDHiNgEcTDGZZQPkqHw
      Ux/AfBKzwvBiDzUCMBYRB0xGfQRgq8fJYgHbVXYUrLSg1Oy+N1XZlEBiKIrJs+QQYeJP
      Ot/Hl9qzK9q5qQP1NfLoEXHAYIXqGgMcJwXQQ=
X-Gm-Message-State: AAQBX9eF+MqTBJdghvMdtKWnqHKZYd0xQWcO+XA5WJjH/Ux5BbBjyGXl
JGbYQtAMQMcNxGmL9iUF
X-Google-Smtp-Source: AKy350YvYKnF+JfaQAFi/9MJMF0cTQWNFGnI/0KPHgEYcDhMGEqHkdJQzWF/o1h6
X-Received: by 2002:a05:600c:1b94:b0:3c3:24f9:2e5e with SMTP id z20-20020a05600c1b9400b003c324f92e5emr1384698wmq.34.1680559419145;
     Mon, 03 Apr 2023 15:23:39 -0700 (PDT)
X-Microsoft-Antispam-Mailbox-Delivery: ucf:1;jmr:0;ex:0;auth:1;dest:I;OFR:CustomRules;ENG:(5062000308)(920221119095)(90000117)(920221120095)(90011020)(91015020)(91040095)(9050020)(9060121)(9081003)(9100341)(944500132)(2008001181)(4810010)(4910033)(9930004)(9545005)(10172021)(9320005)(120001)(1110175);
X-Microsoft-Antispam: BCL:0;PCL:0;RULEID:(1201097)(5061506)(5061507)(2018022401074)(2018022401073)(1220097)(1210098)(1220108);SRVR:SN6PR2101MB1039;
X-MS-Exchange-Organization-SCL: 1
X-Forefront-Antispam-Report: SFV:SKI;SFS:;DIR:INB;SFP:;SCL:1;SRVR:SN6PR2101MB1039;H:SN6PR2101MB1102.namprd21.prod.outlook.com;FPR:;SPF:None;LANG:en;CAT:NONE;
Return-Path: <sender@gmail.com>
Received: from [192.168.1.100] ([66.102.8.15])
     by smtp.gmail.com with ESMTPSA id s16-20020a170902f70900b001d5e8526d5esm2874336wmq.32.2023.
     for <recipient@example.com>
     (version=TLS1_3 cipher=TLS_AES_128_GCM_SHA256 bits=128/128);
     Mon, 03 Apr 2023 15:23:38 -0700 (PDT)
Message-ID: <CAOkxPu6Qa=L+J-uU3Hx1XN=3KQU0gYQdQgYkzE0gQzCCbxL4Ow@mail.gmail.com>
Date: Mon, 3 Apr 2023 18:23:27 -0400
From: John Doe <sender@gmail.com>
Subject: Test Email Subject
To: recipient@example.com
Content-Type: multipart/alternative; boundary="000000000000d68a9605f8e7db4a"
X-Spam-Status: No, score=-0.1
SPF: PASS (sender SPF authorized) identity=mailfrom; client-ip=209.85.221.54; helo=mail-wr1-f54.google.com; envelope-from=sender@gmail.com; receiver=recipient@example.com 
Authentication-Results: mx.example.com;
   dkim=pass header.i  receiver=recipient@example.com 
Authentication-Results: mx.example.com;
   dkim=pass header.i=@gmail.com header.s=20210112 header.b=Yx8Jz9iZ;
   spf=pass (example.com: domain of sender@gmail.com designates 209.85.221.54 as permitted sender) smtp.mailfrom=sender@gmail.com;
   dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com`

      // Parse the sample header
      const parsedData = parseEmailHeader(sampleHeader)

      // Store the parsed data in sessionStorage
      sessionStorage.setItem("parsedHeaderData", JSON.stringify(parsedData))

      // Redirect to the results page
      router.push("/analyze/results")
    } catch (err) {
      console.error("Error in sample page:", err)
      setError("An error occurred while loading the sample. Please try again.")
    }
  }, [router])

  useEffect(() => {
    // Add a button to load a suspicious sample
    const container = document.querySelector(".container")
    if (container && typeof window !== "undefined") {
      const buttonContainer = document.createElement("div")
      buttonContainer.className = "flex justify-center mt-4"

      const button = document.createElement("button")
      button.className = "px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      button.textContent = "Load Suspicious Email Sample"
      button.onclick = () => {
        // Generate a suspicious sample header
        const suspiciousHeader = `Received: from PAWPR10MB8237.EURPRD10.PROD.OUTLOOK.COM (::1) by
 AS8PR10MB6176.EURPRD10.PROD.OUTLOOK.COM with HTTPS; Wed, 2 Apr 2025 22:06:20
 +0000
Received: from DUZPR01CA0306.eurprd01.prod.exchangelabs.com
 (2603:10a6:10:4b7::16) by PAWPR10MB8237.EURPRD10.PROD.OUTLOOK.COM
 (2603:10a6:102:38d::6) with Microsoft SMTP Server (version=TLS1_2,
 cipher=TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384) id 15.20.8583.39; Wed, 2 Apr
 2025 22:06:19 +0000
Authentication-Results: spf=pass (sender IP is 209.85.221.51)
 smtp.mailfrom=gmail.com; dkim=pass (signature was verified)
 header.d=gmail.com;dmarc=pass action=none header.from=gmail.com;compauth=pass
 reason=100
Received-SPF: Pass (protection.outlook.com: domain of gmail.com designates
 209.85.221.51 as permitted sender) receiver=protection.outlook.com;
 client-ip=209.85.221.51; helo=mail-wr1-f51.google.com; pr=C
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
        d=gmail.com; s=20230601; t=1743631578; x=1744236378; darn=outlook.com;
        h=content-transfer-encoding:to:subject:message-id:date:mime-version
         :from:from:to:cc:subject:date:message-id:reply-to;
        bh=ZQvEHR6JjsOSrK7H3uM8F03F7ukjwVaAhgcuhEkSe14=;
        b=mFMZYCO6RAGYDb8Y89IzLHx3XlSsLN00AnlrYQ2QpyaSws7j0DujO+489/EylT47pP
         YygtGKPGH3BV3K6WMFCMF/49T+pogSCF9ScE57ZnzufJAmq8MaJKRddn1GTCZX59IMij
         IJKxbV5TGSp7rxjiu8Ns2cIupnOzY/rBlSMeDl+a90zdwq5PiRVRTiAvlLr0OMzOeQb4
         DL2g/18XL6jsPmne7r0ODKcwyRmwALbmtR5WJ2DBuNV68pygt0UfgISyZ+U4lUFMXVS6
         lBNtayAd2OPO1nysiA/FQ4aN0fsi4S97ppUm8tHGvYMAGXiuWfQjbWcBVGrBrFrdRE2O
         wcuQ==
X-Microsoft-Antispam-Mailbox-Delivery: ucf:1;jmr:0;ex:0;auth:1;dest:I;OFR:CustomRules;ENG:(5062000308)(920221119095)(90000117)(920221120095)(90011020)(91015020)(91040095)(9050020)(9060121)(9081003)(9100341)(944500132)(2008001181)(4810010)(4910033)(9930004)(9545005)(10172021)(9320005)(120001)(1110175);
X-Microsoft-Antispam: BCL:4;PCL:5;RULEID:(1201097)(5061506)(5061507)(2018022401074)(2018022401073)(1220097)(1210098)(1220108);SRVR:SN6PR2101MB1039;
X-MS-Exchange-Organization-SCL: 5
X-Forefront-Antispam-Report: SFV:SPM;SFS:;DIR:INB;SFP:;SCL:5;SRVR:SN6PR2101MB1039;H:SN6PR2101MB1102.namprd21.prod.outlook.com;FPR:;SPF:None;LANG:en;CAT:PHSH;
X-Forefront-Antispam-Report-Untrusted: CIP:255.255.255.255;CTRY:;LANG:en;SCL:5;SRV:;IPV:NLI;SFV:SPM;H:LOYP265MB2237.GBRP265.PROD.OUTLOOK.COM;PTR:;CAT:PHSH;SFS:(13230040)(376014)(366016)(1800799024)(8096899003)(38070700018)(4053099003);DIR:OUT;SFP:1101;
X-Sender-IP: 209.85.221.51
X-Google-Original-From: "TroubleMaker" <troublemaker@outlook.com>
From: TroubleMaker <hommerburner@gmail.com>
Mime-Version: 1.0
Date: Wed, 02 Apr 2025 23:06:17 +0100
X-Mailer: gophish
Message-Id: <1743631577826292495.4154.9021320203330641573@UbuntuX>
Subject: Octopus Energy Bill Reminder
To: "Paulo Bazzo" <bazzofx@outlook.com>
Content-Type: text/html; charset=UTF-8
Content-Transfer-Encoding: quoted-printable`

        try {
          // Parse the suspicious sample header
          const parsedData = parseEmailHeader(suspiciousHeader)

          // Store the parsed data in sessionStorage
          sessionStorage.setItem("parsedHeaderData", JSON.stringify(parsedData))

          // Redirect to the results page
          router.push("/analyze/results")
        } catch (err) {
          console.error("Error loading suspicious sample:", err)
          setError("An error occurred while loading the suspicious sample. Please try again.")
        }
      }

      buttonContainer.appendChild(button)
      container.appendChild(buttonContainer)
    }
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-purple-50 flex items-center justify-center">
        <div className="text-red-600 text-xl p-4 bg-white rounded-lg shadow-md">
          {error}
          <div className="mt-4">
            <button onClick={() => router.push("/")} className="px-4 py-2 bg-purple-600 text-white rounded-md">
              Return to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-purple-50 flex items-center justify-center">
      <div className="container text-purple-700 text-xl">Loading sample analysis...</div>
    </div>
  )
}

