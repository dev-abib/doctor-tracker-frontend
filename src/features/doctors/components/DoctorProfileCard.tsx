import React from "react";
import {
  Stethoscope,
  Building2,
  Phone,
  Mail,
  Users,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Doctor } from "@/types/api";

interface Props {
  doctor: Doctor;
  onEdit?: () => void;
}

export const DoctorProfileCard: React.FC<Props> = ({ doctor }) => {
  return (
    <Card className="overflow-hidden border-border/80 bg-gradient-to-b from-card to-card/50 shadow-md">
      <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 relative" />
      <CardContent className="px-6 pb-6 pt-0 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-5 gap-4">
          <div className="flex items-end gap-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-card bg-primary text-primary-foreground shadow-xl text-3xl font-extrabold">
              {doctor.name.replace("Dr. ", "").charAt(0)}
            </div>
            <div className="mb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-foreground">
                  {doctor.name}
                </h2>
                <Badge variant="success" className="gap-1 text-[11px]">
                  <ShieldCheck className="h-3 w-3" />
                  Active
                </Badge>
              </div>
              <p className="text-sm font-semibold text-primary flex items-center gap-1.5 mt-0.5">
                <Stethoscope className="h-4 w-4" />
                {doctor.specialization} Specialist
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/60 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/40">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-[11px] text-muted-foreground">Affiliated Hospital</p>
              <p className="font-semibold text-foreground truncate">{doctor.hospital}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/40">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-[11px] text-muted-foreground">Email Address</p>
              <p className="font-semibold text-foreground truncate">{doctor.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/40">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-[11px] text-muted-foreground">Phone Number</p>
              <p className="font-semibold text-foreground">{doctor.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/40">
            <Users className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-[11px] text-muted-foreground">Total Patient Roster</p>
              <p className="font-bold text-foreground text-sm">
                {doctor.patientCount ?? 0} Patients
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
