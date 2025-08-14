@@ .. @@
 'use client';

 import React, { useState } from 'react';
-import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
-import { Button } from "@/components/ui/button";
-import { Badge } from "@/components/ui/badge";
-import { useToast } from "@/hooks/use-toast";
-import { useUserStore } from "@/lib/store";
-import { SoundEffect, SOUND_EFFECTS } from '@/components/ui/sound-effect';
-import { Confetti } from '@/components/ui/confetti';
+import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../../components/ui/card";
+import { Button } from "../../components/ui/button";
+import { Badge } from "../../components/ui/badge";
+import { useToast } from "../../hooks/use-toast";
+import { useUserStore } from "../../lib/store";
+import { SoundEffect, SOUND_EFFECTS } from '../../components/ui/sound-effect';
+import { Confetti } from '../../components/ui/confetti';
 import { 
   Coins, Gift, Crown, Star, Zap, Target, Award, 
   CreditCard, Smartphone, Wallet, Percent, Clock,
   TrendingUp, Shield, CheckCircle, Sparkles
 } from "lucide-react";
 import { motion } from "framer-motion";
-import { cn } from '@/lib/utils';
+import { cn } from '../../lib/utils';