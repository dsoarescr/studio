@@ .. @@
 'use client';

 import React from 'react';
 import Link from 'next/link';
 import { usePathname } from 'next/navigation';
-import { Card, CardContent } from "@/components/ui/card";
-import { Button } from "@/components/ui/button";
-import { Separator } from "@/components/ui/separator";
-import { useUserStore } from "@/lib/store";
-import { useAuth } from '@/lib/auth-context';
+import { Card, CardContent } from "../../components/ui/card";
+import { Button } from "../../components/ui/button";
+import { Separator } from "../../components/ui/separator";
+import { useUserStore } from "../../lib/store";
+import { useAuth } from '../../lib/auth-context';
 import { 
   Settings, Paintbrush, Eye, Bell, User, Shield, Zap, Globe, HelpCircle, Coins, Gift, LogOut
 } from "lucide-react";
-import { cn } from "@/lib/utils';
-import { useToast } from '@/hooks/use-toast';
+import { cn } from "../../lib/utils";
+import { useToast } from '../../hooks/use-toast';