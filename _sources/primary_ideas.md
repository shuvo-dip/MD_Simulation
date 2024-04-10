# A Brief Overview of Molecular Dynamics Simulations

This chapter provides an overview of the essential components required for conducting molecular dynamics simulations, with a specific focus on macromolecular systems. We explore the structure of intermolecular potentials for atomically composed or coarse grained molecules and (if possible we go after sytems consisting of non-spherical, sub-units), illustrating methods for computing forces and torques. Additionally, we discuss several widely used molecular dynamics algorithms. Lastly, we touch upon factors influencing the scale of systems and duration of simulations necessary for computing statistical properties.

(section-label-1)=
## Primary Ideas of Molecular Dynamics
**Brief Discussion:**

Computer simulations play a crucial role in understanding molecular assemblies by revealing their structural properties and microscopic interactions. They complement conventional experiments by offering insights that may be otherwise inaccessible. Molecular dynamics (MD) and Monte Carlo (MC) simulations are the main techniques used, with MD being the focus of this lecture due to its ability to predict dynamical properties such as transport coefficients and rheological properties.

Simulations act as a bridge between microscopic and macroscopic scales, providing accurate predictions of bulk properties while revealing hidden details. They also serve as a connection between theory and experiment, enabling testing of theories and models. Additionally, simulations allow exploration of conditions that may be difficult or impossible to replicate in the laboratory.




<blockquote style="background-color: #f8f8f8; border-left: 5px solid #007bff; padding: 10px;">
    <strong style="color: #007bff;">Key Ideas:</strong>
    <ul>
        <li><strong>Role of Simulations:</strong> Simulations complement experiments by providing insights into molecular assemblies that may not be accessible experimentally.</li>
        <li><strong>Main Simulation Techniques:</strong> Molecular dynamics (MD) and Monte Carlo (MC) are the primary simulation techniques, with MD focusing on dynamical properties.</li>
        <li><strong>Bridge between Scales:</strong> Simulations bridge the gap between microscopic and macroscopic scales, offering accurate predictions of bulk properties while revealing hidden details.</li>
        <li><strong>Connection between Theory and Experiment:</strong> Simulations enable testing of theories and models, as well as comparisons with experimental results.</li>
        <li><strong>Exploration of Conditions:</strong> Simulations allow exploration of conditions that may be difficult or impossible to replicate in the laboratory.</li>
        <li><strong>Importance of Molecular Models:</strong> Accurate molecular models are essential for making direct comparisons with experimental measurements, but models containing essential physics may suffice for certain aims.</li>
    </ul>
</blockquote>


**Molecular Dynamics:**

Molecular dynamics (MD) is a widely employed computational technique to compute the equilibrium, dynamical, and transport properties of classical many-body systems. As the quantum effects are neglected for heavier molecules and atoms, the motion of the constituent particles follows laws of classical mechanics obeying the Newtonian equations of motion. For classical many-body systems, the average kinetic energy per degree of freedom is related to the thermal energy via equipartition theorem, $\langle \frac{1}{2}mv_i^2\rangle =\frac{1}{2}k_B T$. The trajectory of individual particles from the MD can be obtained by solving Newton's second laws of motion,

\begin{equation}
\frac{\mathrm{d}^2 \mathbf{r}_i}{\mathrm{d}t^2}\equiv \frac{\mathbf{F}_i}{m}=-\frac{1}{m}\sum_{i\neq j}^N \nabla U(|\mathbf{r}_i -\mathbf{r}_j|),
\end{equation} 

where force $\mathbf{F}_i$ acting on particle $i$, and $t$ denotes the time. By numerically solving Newton's equation of motion (using *e.g.* velocity-verlet algorithm), one computes the position of every particle after a given time step. In standard MD simulation, typical timesteps $\sim 10^{-15}$s (however, vary by the requirements of the system property) compared to the real time scale. A simplified flowchart of a typical MD simulation is shown in the Fig.~\eqref{flowchart01}.

![Flowchart](md_flowchart.jpg)


Once the system acquires an equilibrium state, the total potential energy is independent of subsequent iterations. If the system is at equilibrium state, *i.e.* time evolution is equivalent to the configuration, as the thermodynamics state is considered to be ergodic. Since the positions, velocities are known, one can calculate pair correlation distributions, structure factor, which are essentially calculated by taking an average of over different realisations. In order to get a statistical average of a system with a thermally excited state to reach equilibrium state by dynamical phase transitions, needs to average over different configurations emerge from different initial states. A major problem sometimes arises in MD simulations, while small numerical errors arise from the numerical integration of the equation of motion. Which could piles up over many steps and invoke the kinetic energy, hence change the average temperature. This temperature drift can be circumvented by occasionally rescaling the velocity of the particles. 

We use `LAMMPS` [@p:plimpton1995], in order to perform MD simulations in every complex system that we discuss over the thesis. For the visualization purpose we use `OVITO` [@p:stukowski2010] molecules viewer. However, to perform post-processing data analysis from the trajectory files and figure generation, we use `MATLAB` programming language.
```{tip}
Here is some helpful tips
```
## Importance of Molecular Simulations

Molecular simulations play a crucial role in various fields such as chemistry, physics, materials science, and biology.

