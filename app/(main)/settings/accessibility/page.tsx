@@ .. @@
 'use client';

 import React, { useState } from 'react';
-import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
-import { Button } from "@/components/ui/button";
-import { Switch } from "@/components/ui/switch";
-import { Label } from "@/components/ui/label";
-import { Slider } from "@/components/ui/slider";
-import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
-import { useToast } from "@/hooks/use-toast";
+import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
+import { Button } from "../../../components/ui/button";
+import { Switch } from "../../../components/ui/switch";
+import { Label } from "../../../components/ui/label";
+import { Slider } from "../../../components/ui/slider";
+import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
+import { useToast } from "../../../hooks/use-toast";
 import { 
   Eye, Type, Contrast, Volume2, Hand, Keyboard, 
   MousePointer, Accessibility, Save, RefreshCw, 
   Glasses, Ear, Brain, Heart
 } from "lucide-react";