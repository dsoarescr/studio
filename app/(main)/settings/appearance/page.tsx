@@ .. @@
 'use client';

 import React, { useState } from 'react';
-import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
-import { Button } from "@/components/ui/button";
-import { Switch } from "@/components/ui/switch";
-import { Label } from "@/components/ui/label";
-import { Slider } from "@/components/ui/slider";
-import { Badge } from "@/components/ui/badge";
-import { useToast } from "@/hooks/use-toast";
-import { useSettingsStore } from "@/lib/store";
-import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
+import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
+import { Button } from "../../../components/ui/button";
+import { Switch } from "../../../components/ui/switch";
+import { Label } from "../../../components/ui/label";
+import { Slider } from "../../../components/ui/slider";
+import { Badge } from "../../../components/ui/badge";
+import { useToast } from "../../../hooks/use-toast";
+import { useSettingsStore } from "../../../lib/store";
+import { SoundEffect, SOUND_EFFECTS } from '../../../components/ui/sound-effect';
 import { Palette, Sun, Moon, Monitor, Sparkles, Eye, Contrast, Copyright as Brightness, Type, Grid, Zap, Crown, Star, Save, RefreshCw } from "lucide-react";
-import { cn } from '@/lib/utils';
+import { cn } from '../../../lib/utils';