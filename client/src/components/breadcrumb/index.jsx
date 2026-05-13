import { Link } from "react-router";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Slash } from "lucide-react";

const BreadcrumbCustom = ({ pageName }) => {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList className={"text-[#72827a]"}>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={"/dashboard/users"}>Users</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink className="font-bold text-[#24352f]">{pageName}</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbCustom;
